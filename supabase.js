// Supabase Configuration
const SUPABASE_URL = 'https://yqrdpsecootesmqhkcyl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxcmRwc2Vjb290ZXNtcWhrY3lsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwODQ2MDksImV4cCI6MjA4MTY2MDYwOX0.EJ2RK94I4R0t897IMf7ZpTDD36-2kcKmlIJL0pBCZK8';

// Initialize Supabase Client
let supabaseClient = null;

// Check if Supabase library is loaded
if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('✅ Supabase client initialized successfully');
} else {
    console.error('❌ Supabase library not loaded! Make sure the CDN script is included before this file.');
}

// ===========================
// SUPABASE AUTH FUNCTIONS
// ===========================

// Sign Up with Email
window.supabaseSignUp = async function (email, password, name) {
    if (!supabaseClient) {
        throw new Error('Supabase client not initialized');
    }

    const { data, error } = await supabaseClient.auth.signUp({
        email: email,
        password: password,
        options: {
            data: {
                full_name: name
            }
        }
    });

    if (error) {
        throw error;
    }

    return data;
};

// Sign In with Email
window.supabaseSignIn = async function (email, password) {
    if (!supabaseClient) {
        throw new Error('Supabase client not initialized');
    }

    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (error) {
        throw error;
    }

    return data;
};

// Sign Out
window.supabaseSignOut = async function () {
    if (!supabaseClient) {
        throw new Error('Supabase client not initialized');
    }

    const { error } = await supabaseClient.auth.signOut();

    if (error) {
        throw error;
    }
};

// Reset Password (sends email)
window.supabaseResetPassword = async function (email) {
    if (!supabaseClient) {
        throw new Error('Supabase client not initialized');
    }

    const { data, error } = await supabaseClient.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin
    });

    if (error) {
        throw error;
    }

    return data;
};

// Get Current User
window.getCurrentUser = async function () {
    if (!supabaseClient) return null;
    const { data: { user } } = await supabaseClient.auth.getUser();
    return user;
};

// Get Current Session
window.getSession = async function () {
    if (!supabaseClient) return null;
    const { data: { session } } = await supabaseClient.auth.getSession();
    return session;
};

// Listen to Auth State Changes
if (supabaseClient) {
    supabaseClient.auth.onAuthStateChange((event, session) => {
        console.log('Auth state changed:', event, session);

        if (event === 'SIGNED_IN' && session) {
            updateUIForLoggedInUser(session.user);
        } else if (event === 'SIGNED_OUT') {
            updateUIForLoggedOutUser();
        }
    });
}

// Update UI for logged in user
function updateUIForLoggedInUser(user) {
    const userBtn = document.getElementById('userBtn');
    if (userBtn) {
        userBtn.classList.add('logged-in');
        userBtn.setAttribute('aria-label', 'Hesabım');
    }

    // Store user info for display
    window.currentSupabaseUser = user;
}

// Update UI for logged out user
function updateUIForLoggedOutUser() {
    const userBtn = document.getElementById('userBtn');
    if (userBtn) {
        userBtn.classList.remove('logged-in');
        userBtn.setAttribute('aria-label', 'Giriş Yap');
    }

    window.currentSupabaseUser = null;
}

// Check initial auth state on page load
async function checkAuthState() {
    if (!supabaseClient) return;
    const session = await getSession();
    if (session && session.user) {
        updateUIForLoggedInUser(session.user);
    }
}

// Run on page load
checkAuthState();

// ===========================
// SUPABASE DATABASE FUNCTIONS
// ===========================

// Save Order to Database
window.saveOrderToDatabase = async function (orderData) {
    if (!supabaseClient) {
        console.error('Supabase client not initialized');
        return null;
    }

    const user = window.currentSupabaseUser;
    if (!user) {
        console.log('User not logged in, order saved locally only');
        return null;
    }

    const { data, error } = await supabaseClient
        .from('orders')
        .insert([{
            user_id: user.id,
            order_number: orderData.orderNum,
            items: JSON.stringify(orderData.items),
            total: orderData.total,
            status: 'pending'
        }])
        .select();

    if (error) {
        console.error('Error saving order:', error);
        return null;
    }

    console.log('✅ Order saved to database:', data);
    return data;
};

// Get User Orders from Database
window.getUserOrders = async function () {
    if (!supabaseClient) {
        console.error('Supabase client not initialized');
        return [];
    }

    const user = window.currentSupabaseUser;
    if (!user) {
        console.log('User not logged in');
        return [];
    }

    const { data, error } = await supabaseClient
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching orders:', error);
        return [];
    }

    return data || [];
};
