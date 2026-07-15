async function runTest() {
  try {
    const healthRes = await fetch('http://localhost:5000/api/health').catch(e => {
      console.log('Health check failed: API server might not be running yet.');
      return null;
    });
    if (!healthRes) return;
    
    console.log('Health check status:', healthRes.status, await healthRes.json());
    
    // Create random credentials
    const email = `testuser_${Date.now()}@example.com`;
    const password = 'password123';
    
    // 1. Test Signup
    console.log('\n--- 1. Testing Signup ---');
    const signupRes = await fetch('http://localhost:5000/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const signupData = await signupRes.json();
    console.log('Signup response status:', signupRes.status, JSON.stringify(signupData, null, 2));
    
    if (signupRes.status !== 201) {
      throw new Error('Signup failed');
    }
    
    // Extract actual user data (if unwrapped by standard response middleware)
    const signupUser = signupData.data?.user || signupData.user;
    const token = signupData.data?.token || signupData.token;
    
    console.log('Returned Token:', token ? 'Exists' : 'Missing');
    console.log('Returned User isNewUser flag:', signupUser?.isNewUser);
    if (signupUser?.isNewUser !== true) {
      throw new Error('Expected isNewUser to be true for newly registered user');
    }
    
    // 2. Test seen-about
    console.log('\n--- 2. Testing Seen-About ---');
    const seenRes = await fetch('http://localhost:5000/api/auth/seen-about', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    const seenData = await seenRes.json();
    console.log('Seen-About response status:', seenRes.status, JSON.stringify(seenData, null, 2));
    if (seenRes.status !== 200) {
      throw new Error('Seen-About endpoint failed');
    }
    
    const seenUser = seenData.data?.user || seenData.user;
    if (seenUser?.isNewUser !== false) {
      throw new Error('Expected isNewUser to be false after marking seen');
    }
    
    // 3. Test Login
    console.log('\n--- 3. Testing Login ---');
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const loginData = await loginRes.json();
    console.log('Login response status:', loginRes.status, JSON.stringify(loginData, null, 2));
    if (loginRes.status !== 200) {
      throw new Error('Login failed');
    }
    
    const loginUser = loginData.data?.user || loginData.user;
    if (loginUser?.isNewUser !== false) {
      throw new Error('Expected isNewUser to be false for returning user who completed onboarding');
    }
    
    console.log('\nAll tests passed successfully!');
  } catch (err) {
    console.error('Test failed:', err);
  }
}

runTest();
