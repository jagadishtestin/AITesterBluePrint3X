package com.salesforce.tests;

import com.salesforce.pages.LoginPage;
import org.testng.Assert;
import org.testng.annotations.Parameters;
import org.testng.annotations.Test;

public class LoginValidTest extends BaseTest {

    @Test
    @Parameters({"validUsername", "validPassword"})
    public void testValidLogin(String username, String password) {
        LoginPage page = new LoginPage(driver);
        page.open();
        page.doLogin(username, password, false);
        boolean loggedIn = page.isLoggedIn();
        Assert.assertTrue(loggedIn, "Expected to be logged in with valid credentials");
    }
}
