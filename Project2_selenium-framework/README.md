Selenium Java TestNG framework

Structure:
- src/main/java/com/salesforce/pages/LoginPage.java
- src/test/java/com/salesforce/tests/BaseTest.java
- src/test/java/com/salesforce/tests/LoginValidTest.java
- src/test/java/com/salesforce/tests/LoginInvalidTest.java

Run tests:

mvn test -DvalidUsername=<username> -DvalidPassword=<password>

Notes:
- Provide valid Salesforce credentials via system properties or update testng.xml parameters.
- The framework uses WebDriverManager to manage the ChromeDriver binary.
