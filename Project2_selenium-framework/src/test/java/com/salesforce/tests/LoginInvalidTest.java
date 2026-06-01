package com.salesforce.tests;

import com.salesforce.pages.LoginPage;
import org.testng.Assert;
import org.testng.annotations.Parameters;
import org.testng.annotations.Test;

public class LoginInvalidTest extends BaseTest {

    @Test
    @Parameters({"invalidUsername", "invalidPassword"})
    public void testInvalidLogin(String username, String password) {
        LoginPage page = new LoginPage(driver);
        page.open();
        page.doLogin(username, password, false);
        boolean error = page.isErrorDisplayed();
        Assert.assertTrue(error || !page.isLoggedIn(), "Expected login failure for invalid credentials");
    }
}
