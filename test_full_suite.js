const BASE_URL = 'http://localhost:5000/api';

async function testSuite() {
  console.log('=== STARTING FINPILOT FULL INTEGRATION TEST SUITE ===\n');
  const session = {
    token: null,
    userId: null,
    email: `test_qa_${Date.now()}@example.com`,
    password: 'password12345'
  };

  try {
    // -------------------------------------------------------------
    // 1. Health Check
    // -------------------------------------------------------------
    console.log('[TEST] Checking API server health...');
    const healthRes = await fetch(`${BASE_URL}/health`).catch(err => {
      throw new Error(`API Server is not running. Please start it using 'npm run dev' or 'npm run start' before running the tests. Detail: ${err.message}`);
    });
    if (healthRes.status !== 200) {
      throw new Error(`Health check returned status code ${healthRes.status}`);
    }
    const healthJson = await healthRes.json();
    console.log('  -> Health Check Passed:', JSON.stringify(healthJson.data || healthJson));

    // -------------------------------------------------------------
    // 2. Authentication
    // -------------------------------------------------------------
    console.log('\n[TEST] Registering new QA user...');
    const signupRes = await fetch(`${BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: session.email, password: session.password })
    });
    const signupJson = await signupRes.json();
    const signupData = signupJson.data || signupJson;
    if (signupRes.status !== 201) {
      throw new Error(`Signup failed with status ${signupRes.status}: ${JSON.stringify(signupJson)}`);
    }
    session.token = signupData.token;
    session.userId = signupData.user.id || signupData.user._id;
    console.log(`  -> User Registered: ${session.email} (ID: ${session.userId})`);
    if (signupData.user.isNewUser !== true) {
      throw new Error('New user should have isNewUser flag set to true');
    }
    console.log('  -> isNewUser flag is correctly true');

    // Test seen-about
    console.log('\n[TEST] Marking Onboarding / About seen...');
    const seenRes = await fetch(`${BASE_URL}/auth/seen-about`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.token}`
      }
    });
    const seenJson = await seenRes.json();
    const seenData = seenJson.data || seenJson;
    if (seenRes.status !== 200) {
      throw new Error(`Seen-About failed with status ${seenRes.status}: ${JSON.stringify(seenJson)}`);
    }
    if (seenData.user.isNewUser !== false) {
      throw new Error('User isNewUser flag should be false after seen-about call');
    }
    console.log('  -> isNewUser successfully updated to false');

    // Test login
    console.log('\n[TEST] Logging in QA user...');
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: session.email, password: session.password })
    });
    const loginJson = await loginRes.json();
    const loginData = loginJson.data || loginJson;
    if (loginRes.status !== 200) {
      throw new Error(`Login failed with status ${loginRes.status}`);
    }
    if (loginData.user.isNewUser !== false) {
      throw new Error('Returning user should not be marked as new');
    }
    console.log('  -> Login Passed, token verified');

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.token}`
    };

    // -------------------------------------------------------------
    // 3. Transactions CRUD
    // -------------------------------------------------------------
    console.log('\n[TEST] Transactions CRUD testing...');
    // Create
    const createTxRes = await fetch(`${BASE_URL}/transactions`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        type: 'expense',
        amount: 45.50,
        category: 'Food',
        description: 'QA Dinner test'
      })
    });
    const createTxJson = await createTxRes.json();
    const tx = createTxJson.data || createTxJson;
    if (createTxRes.status !== 201) {
      throw new Error(`Transaction creation failed: ${JSON.stringify(createTxJson)}`);
    }
    console.log(`  -> Created Transaction ID: ${tx._id || tx.id}`);

    // Read list
    const listTxRes = await fetch(`${BASE_URL}/transactions`, { headers });
    const listTxJson = await listTxRes.json();
    const listTx = listTxJson.data || listTxJson;
    if (listTxRes.status !== 200 || !Array.isArray(listTx) || listTx.length === 0) {
      throw new Error('List transactions failed or returned empty');
    }
    console.log(`  -> Listed ${listTx.length} transactions successfully`);

    // Read details
    const getTxRes = await fetch(`${BASE_URL}/transactions/${tx._id || tx.id}`, { headers });
    const getTxJson = await getTxRes.json();
    const getTx = getTxJson.data || getTxJson;
    if (getTxRes.status !== 200 || getTx.category !== 'Food') {
      throw new Error('Get transaction by ID failed');
    }
    console.log('  -> Retrieve transaction by ID passed');

    // Update
    const updateTxRes = await fetch(`${BASE_URL}/transactions/${tx._id || tx.id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ amount: 50.00, category: 'Dining' })
    });
    const updateTxJson = await updateTxRes.json();
    const updateTx = updateTxJson.data || updateTxJson;
    if (updateTxRes.status !== 200 || updateTx.amount !== 50.00 || updateTx.category !== 'Dining') {
      throw new Error('Update transaction failed');
    }
    console.log('  -> Update transaction passed');

    // Delete
    const deleteTxRes = await fetch(`${BASE_URL}/transactions/${tx._id || tx.id}`, {
      method: 'DELETE',
      headers
    });
    if (deleteTxRes.status !== 200) {
      throw new Error('Delete transaction failed');
    }
    console.log('  -> Delete transaction passed');

    // -------------------------------------------------------------
    // 4. Budgets CRUD
    // -------------------------------------------------------------
    console.log('\n[TEST] Budgets CRUD testing...');
    // Create
    const createBRes = await fetch(`${BASE_URL}/budgets`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        category: 'Entertainment',
        limit: 200.00,
        month: '2026-08'
      })
    });
    const createBJson = await createBRes.json();
    const budget = createBJson.data || createBJson;
    if (createBRes.status !== 201) {
      throw new Error(`Budget creation failed: ${JSON.stringify(createBJson)}`);
    }
    console.log(`  -> Created Budget ID: ${budget._id || budget.id}`);

    // Read list
    const listBRes = await fetch(`${BASE_URL}/budgets?month=2026-08`, { headers });
    const listBJson = await listBRes.json();
    const listB = listBJson.data || listBJson;
    if (listBRes.status !== 200 || !Array.isArray(listB) || listB.length === 0) {
      throw new Error('List budgets failed');
    }
    console.log(`  -> Listed budgets successfully`);

    // Update
    const updateBRes = await fetch(`${BASE_URL}/budgets/${budget._id || budget.id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ limit: 250.00 })
    });
    const updateBJson = await updateBRes.json();
    const updateB = updateBJson.data || updateBJson;
    if (updateBRes.status !== 200 || updateB.limit !== 250.00) {
      throw new Error('Update budget failed');
    }
    console.log('  -> Update budget passed');

    // Delete
    const deleteBRes = await fetch(`${BASE_URL}/budgets/${budget._id || budget.id}`, {
      method: 'DELETE',
      headers
    });
    if (deleteBRes.status !== 200) {
      throw new Error('Delete budget failed');
    }
    console.log('  -> Delete budget passed');

    // -------------------------------------------------------------
    // 5. Goals CRUD
    // -------------------------------------------------------------
    console.log('\n[TEST] Goals CRUD testing...');
    // Create
    const createGRes = await fetch(`${BASE_URL}/goals`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        title: 'New Car Fund',
        targetAmount: 15000.00,
        deadline: '2027-12-31',
        category: 'savings',
        priority: 'high'
      })
    });
    const createGJson = await createGRes.json();
    const goal = createGJson.data || createGJson;
    if (createGRes.status !== 201) {
      throw new Error(`Goal creation failed: ${JSON.stringify(createGJson)}`);
    }
    console.log(`  -> Created Goal ID: ${goal._id || goal.id}`);

    // Read list
    const listGRes = await fetch(`${BASE_URL}/goals`, { headers });
    const listGJson = await listGRes.json();
    const listG = listGJson.data || listGJson;
    if (listGRes.status !== 200 || !Array.isArray(listG) || listG.length === 0) {
      throw new Error('List goals failed');
    }
    console.log(`  -> Listed goals successfully`);

    // Update
    const updateGRes = await fetch(`${BASE_URL}/goals/${goal._id || goal.id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ currentAmount: 500.00 })
    });
    const updateGJson = await updateGRes.json();
    const updateG = updateGJson.data || updateGJson;
    if (updateGRes.status !== 200 || updateG.currentAmount !== 500.00) {
      throw new Error('Update goal failed');
    }
    console.log('  -> Update goal passed');

    // Delete
    const deleteGRes = await fetch(`${BASE_URL}/goals/${goal._id || goal.id}`, {
      method: 'DELETE',
      headers
    });
    if (deleteGRes.status !== 200) {
      throw new Error('Delete goal failed');
    }
    console.log('  -> Delete goal passed');

    // -------------------------------------------------------------
    // 6. Subscriptions CRUD
    // -------------------------------------------------------------
    console.log('\n[TEST] Subscriptions CRUD testing...');
    // Create
    const createSubRes = await fetch(`${BASE_URL}/subscriptions`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        name: 'Streaming Service',
        amount: 14.99,
        frequency: 'monthly',
        category: 'Entertainment'
      })
    });
    const createSubJson = await createSubRes.json();
    const sub = createSubJson.data || createSubJson;
    if (createSubRes.status !== 201) {
      throw new Error(`Subscription creation failed: ${JSON.stringify(createSubJson)}`);
    }
    console.log(`  -> Created Subscription ID: ${sub._id || sub.id}`);

    // Read list
    const listSubRes = await fetch(`${BASE_URL}/subscriptions`, { headers });
    const listSubJson = await listSubRes.json();
    const listSub = listSubJson.data || listSubJson;
    if (listSubRes.status !== 200 || !Array.isArray(listSub) || listSub.length === 0) {
      throw new Error('List subscriptions failed');
    }
    console.log(`  -> Listed subscriptions successfully`);

    // Update
    const updateSubRes = await fetch(`${BASE_URL}/subscriptions/${sub._id || sub.id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ amount: 15.99 })
    });
    const updateSubJson = await updateSubRes.json();
    const updateSub = updateSubJson.data || updateSubJson;
    if (updateSubRes.status !== 200 || updateSub.amount !== 15.99) {
      throw new Error('Update subscription failed');
    }
    console.log('  -> Update subscription passed');

    // Cancel (Patch)
    const cancelSubRes = await fetch(`${BASE_URL}/subscriptions/${sub._id || sub.id}/cancel`, {
      method: 'PATCH',
      headers
    });
    const cancelSubJson = await cancelSubRes.json();
    const cancelSub = cancelSubJson.data || cancelSubJson;
    if (cancelSubRes.status !== 200 || cancelSub.active !== false) {
      throw new Error('Cancel subscription failed');
    }
    console.log('  -> Cancel subscription passed');

    // Delete
    const deleteSubRes = await fetch(`${BASE_URL}/subscriptions/${sub._id || sub.id}`, {
      method: 'DELETE',
      headers
    });
    if (deleteSubRes.status !== 200) {
      throw new Error('Delete subscription failed');
    }
    console.log('  -> Delete subscription passed');

    // -------------------------------------------------------------
    // 7. Dashboard Overview & Analytics Insights
    // -------------------------------------------------------------
    console.log('\n[TEST] Dashboard summary & Analytics Insights...');
    const dashRes = await fetch(`${BASE_URL}/dashboard`, { headers });
    const dashJson = await dashRes.json();
    const dashData = dashJson.data || dashJson;
    if (dashRes.status !== 200 || dashData.balance === undefined) {
      throw new Error('Get Dashboard overview failed');
    }
    console.log('  -> Dashboard Summary retrieve passed');

    const insightsRes = await fetch(`${BASE_URL}/analytics/insights`, { headers });
    const insightsJson = await insightsRes.json();
    if (insightsRes.status !== 200) {
      throw new Error('Get Analytics Insights failed');
    }
    console.log('  -> Analytics Insights retrieve passed');

    // -------------------------------------------------------------
    // 8. Feedback (Public & Authenticated Admin Views)
    // -------------------------------------------------------------
    console.log('\n[TEST] Feedback routes testing...');
    // Public post feedback
    const feedbackPostRes = await fetch(`${BASE_URL}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'QA Tester',
        email: session.email,
        rating: 5,
        message: 'This software is incredibly secure and robust. Well done!'
      })
    });
    const feedbackPostJson = await feedbackPostRes.json();
    if (feedbackPostRes.status !== 201 || feedbackPostJson.success !== true) {
      throw new Error(`Submit feedback failed: ${JSON.stringify(feedbackPostJson)}`);
    }
    console.log('  -> Submit feedback passed');

    // Authenticated list feedback
    const feedbackListRes = await fetch(`${BASE_URL}/feedback`, { headers });
    const feedbackListJson = await feedbackListRes.json();
    if (feedbackListRes.status !== 200 || feedbackListJson.success !== true) {
      throw new Error('Get feedback lists failed');
    }
    console.log(`  -> Admin feed list returned ${feedbackListJson.count || feedbackListJson.data?.length} feedback items`);

    // Authenticated feedback stats overview
    const feedbackStatsRes = await fetch(`${BASE_URL}/feedback/stats/overview`, { headers });
    const feedbackStatsJson = await feedbackStatsRes.json();
    if (feedbackStatsRes.status !== 200 || feedbackStatsJson.success !== true) {
      throw new Error('Get feedback stats overview failed');
    }
    console.log('  -> Admin feedback stats retrieve passed');

    // -------------------------------------------------------------
    // 9. Newsletter Subscriptions
    // -------------------------------------------------------------
    console.log('\n[TEST] Newsletter subscriptions testing...');
    const newsSubRes = await fetch(`${BASE_URL}/newsletter/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: session.email })
    });
    const newsSubJson = await newsSubRes.json();
    if (newsSubRes.status !== 201 || newsSubJson.success !== true) {
      throw new Error(`Newsletter subscribe failed: ${JSON.stringify(newsSubJson)}`);
    }
    console.log('  -> Newsletter subscription passed');

    const newsUnsubRes = await fetch(`${BASE_URL}/newsletter/unsubscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: session.email })
    });
    const newsUnsubJson = await newsUnsubRes.json();
    if (newsUnsubRes.status !== 200 || newsUnsubJson.success !== true) {
      throw new Error(`Newsletter unsubscribe failed: ${JSON.stringify(newsUnsubJson)}`);
    }
    console.log('  -> Newsletter unsubscribe passed');

    console.log('\n======================================================');
    console.log('SUCCESS: All integration test modules passed perfectly!');
    console.log('======================================================');

  } catch (err) {
    console.error('\n======================================================');
    console.error('FAILURE: Test suite execution halted due to error:');
    console.error(err.message);
    console.error('======================================================');
  }
}

testSuite();
