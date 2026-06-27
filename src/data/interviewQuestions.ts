// ============================================================
// SDET Interview Questions — Comprehensive Handbook Data
// Covers: Selenium WebDriver, REST Assured, Appium,
//         REST/SOAP/WSDL, Performance Testing, General SDET
// ============================================================

export type QuestionLevel =
  | 'basic'
  | 'intermediate'
  | 'advanced'
  | 'scenario'
  | 'coding'
  | 'mcq'
  | 'rapid-fire'
  | 'company-specific'
  | 'behavioral';

export interface InterviewQuestion {
  id: string;
  moduleId: string;
  question: string;
  answer: string;
  level: QuestionLevel;
  tags: string[];
  codeExample?: string;
  options?: string[];      // for MCQ
  correctOption?: number;  // for MCQ (0-indexed)
}

// ============================================================
// MODULE 1 — selenium-webdriver  (25 questions)
// ============================================================

const seleniumQuestions: InterviewQuestion[] = [

  // ---- BASIC ------------------------------------------------

  {
    id: 'sel-001',
    moduleId: 'selenium-webdriver',
    question: 'What is Selenium WebDriver, and how does it differ from Selenium RC?',
    answer: `Selenium WebDriver is an open-source browser-automation framework that communicates **directly** with browsers through their native APIs (W3C WebDriver protocol). It does NOT require an intermediate server process.

Key differences from Selenium RC (Remote Control):
• **Architecture** — WebDriver talks directly to the browser; RC used a JavaScript injection proxy server.
• **Speed** — WebDriver is significantly faster because there is no HTTP proxy in the middle.
• **API** — WebDriver has a cleaner, more object-oriented API.
• **Browser support** — WebDriver supports all modern browsers via dedicated drivers (ChromeDriver, GeckoDriver, etc.).
• **Security restrictions** — RC was limited by browser sandbox; WebDriver uses native OS-level calls.
• **Maintenance** — RC is deprecated since Selenium 3; WebDriver is the current standard.

WebDriver implements the W3C WebDriver specification, making it a universal standard for browser automation.`,
    level: 'basic',
    tags: ['selenium', 'webdriver', 'architecture', 'RC'],
  },

  {
    id: 'sel-002',
    moduleId: 'selenium-webdriver',
    question: 'What are the different locator strategies in Selenium WebDriver?',
    answer: `Selenium provides 8 built-in locator strategies via the \`By\` class:

1. **By.id("elementId")** — Fastest; locates by the HTML \`id\` attribute. Preferred when available.
2. **By.name("elementName")** — Locates by the \`name\` attribute. Common on form fields.
3. **By.className("cssClass")** — Locates by CSS class name. Avoid if multiple elements share the class.
4. **By.tagName("tagName")** — Locates by HTML tag (e.g., \`input\`, \`button\`). Returns multiple elements.
5. **By.linkText("Exact Link Text")** — Matches the full visible text of an anchor \`<a>\` tag.
6. **By.partialLinkText("Partial")** — Matches a substring of anchor text.
7. **By.cssSelector("css selector")** — Very powerful; supports attribute, pseudo-class, descendant selectors.
8. **By.xpath("//xpath/expression")** — Most flexible; can traverse the DOM in any direction.

**Priority order for choosing a locator:**
id > name > cssSelector > xpath

XPath should be used only when simpler locators aren't reliable, as it can be fragile with DOM changes.`,
    level: 'basic',
    tags: ['selenium', 'locators', 'By', 'xpath', 'cssSelector'],
  },

  {
    id: 'sel-003',
    moduleId: 'selenium-webdriver',
    question: 'What are the different types of waits in Selenium? When should you use each?',
    answer: `Selenium provides three types of waits to handle synchronization between the test and the browser:

**1. Implicit Wait**
Set once globally. Tells WebDriver to poll the DOM for a specified amount of time before throwing a NoSuchElementException.
\`driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));\`
- Applies to ALL findElement calls.
- Cannot be used with ExpectedConditions.
- Anti-pattern if mixed with explicit waits — causes unpredictable delays.

**2. Explicit Wait (WebDriverWait + ExpectedConditions)**
Waits for a specific condition to be true before proceeding.
\`\`\`java
WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(15));
WebElement el = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("submit")));
\`\`\`
- Preferred approach — targeted and precise.
- Supports custom ExpectedConditions.

**3. Fluent Wait**
A superset of explicit wait with configurable polling interval and ignored exceptions.
\`\`\`java
Wait<WebDriver> fluentWait = new FluentWait<>(driver)
    .withTimeout(Duration.ofSeconds(30))
    .pollingEvery(Duration.ofMillis(500))
    .ignoring(NoSuchElementException.class);
\`\`\`
- Best for elements that appear/disappear intermittently.

**Thread.sleep()** — hardcoded sleep; NEVER use in production tests.`,
    level: 'basic',
    tags: ['selenium', 'waits', 'implicit', 'explicit', 'fluent', 'synchronization'],
  },

  // ---- INTERMEDIATE -----------------------------------------

  {
    id: 'sel-004',
    moduleId: 'selenium-webdriver',
    question: 'Explain the Page Object Model (POM) design pattern and its benefits.',
    answer: `The **Page Object Model (POM)** is a design pattern that creates a separate class for each web page (or component) in the application under test. Each class encapsulates the web elements (as fields) and the actions that can be performed on that page (as methods).

**Structure:**
- **Page Class** — contains locators as \`By\` or \`WebElement\` fields and methods that represent user actions.
- **Test Class** — instantiates page objects and calls their methods; contains NO locators or direct driver calls.

**Benefits:**
1. **Maintainability** — When UI changes, only the page class needs updating, not every test.
2. **Reusability** — Page methods can be called from multiple test classes.
3. **Readability** — Tests read like plain English: \`loginPage.enterUsername("admin").clickLogin();\`
4. **Separation of concerns** — Test logic and UI interaction logic are decoupled.
5. **Reduced duplication** — Locators and actions are defined once.

**PageFactory** — Selenium's built-in POM support using \`@FindBy\` annotations for lazy element initialization.

Best practice: Use a **BasePage** class to hold shared driver instance, wait utilities, and common methods (click, type, waitForElement), then extend it in every page class.`,
    level: 'intermediate',
    tags: ['POM', 'design-pattern', 'page-object', 'PageFactory', 'maintainability'],
    codeExample: `// BasePage.java
public class BasePage {
    protected WebDriver driver;
    protected WebDriverWait wait;

    public BasePage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        PageFactory.initElements(driver, this);
    }

    protected void click(WebElement element) {
        wait.until(ExpectedConditions.elementToBeClickable(element)).click();
    }

    protected void type(WebElement element, String text) {
        element.clear();
        element.sendKeys(text);
    }
}

// LoginPage.java
public class LoginPage extends BasePage {
    @FindBy(id = "username")
    private WebElement usernameField;

    @FindBy(id = "password")
    private WebElement passwordField;

    @FindBy(id = "loginBtn")
    private WebElement loginButton;

    public LoginPage(WebDriver driver) {
        super(driver);
    }

    public LoginPage enterUsername(String username) {
        type(usernameField, username);
        return this;
    }

    public LoginPage enterPassword(String password) {
        type(passwordField, password);
        return this;
    }

    public DashboardPage clickLogin() {
        click(loginButton);
        return new DashboardPage(driver);
    }
}

// LoginTest.java
public class LoginTest {
    WebDriver driver;

    @BeforeMethod
    public void setUp() {
        driver = new ChromeDriver();
        driver.get("https://example.com/login");
    }

    @Test
    public void testValidLogin() {
        LoginPage loginPage = new LoginPage(driver);
        DashboardPage dashboard = loginPage
            .enterUsername("admin")
            .enterPassword("secret")
            .clickLogin();
        Assert.assertTrue(dashboard.isLoaded(), "Dashboard should be visible after login");
    }

    @AfterMethod
    public void tearDown() {
        driver.quit();
    }
}`,
  },

  {
    id: 'sel-005',
    moduleId: 'selenium-webdriver',
    question: 'Explain TestNG annotations and their execution order. What is a DataProvider?',
    answer: `**TestNG Annotations (execution order):**

1. \`@BeforeSuite\` — runs once before all tests in the suite.
2. \`@BeforeTest\` — runs before any test method in the \`<test>\` tag.
3. \`@BeforeClass\` — runs once before the first test method in the class.
4. \`@BeforeMethod\` — runs before EACH test method (ideal for WebDriver setup).
5. \`@Test\` — marks the actual test method.
6. \`@AfterMethod\` — runs after EACH test method (ideal for WebDriver teardown).
7. \`@AfterClass\` — runs once after all tests in the class.
8. \`@AfterTest\` — runs after all tests in the \`<test>\` tag.
9. \`@AfterSuite\` — runs once after all tests in the suite.

**Other useful annotations:**
- \`@DataProvider\` — supplies data to tests for data-driven testing.
- \`@Parameters\` — injects XML parameters into test methods.
- \`@Listeners\` — attaches TestNG listeners (e.g., for reporting).
- \`@Factory\` — creates test objects dynamically.

**@DataProvider:**
Allows a test method to run multiple times with different data sets. The method must return \`Object[][]\` or \`Iterator<Object[]>\`.

The \`@Test\` method receives one row of data per invocation. DataProvider supports parallel execution via \`parallel = true\`.`,
    level: 'intermediate',
    tags: ['TestNG', 'annotations', 'DataProvider', 'data-driven', 'lifecycle'],
    codeExample: `// DataProvider example
public class LoginDataProvider {

    @DataProvider(name = "loginData", parallel = true)
    public Object[][] provideLoginData() {
        return new Object[][] {
            {"admin",    "admin123",  true,  "Admin Dashboard"},
            {"user1",    "pass1",     true,  "User Dashboard"},
            {"invalid",  "wrong",     false, "Invalid credentials"},
            {"",         "",          false, "Username is required"},
        };
    }
}

// Test using the DataProvider
public class LoginTest extends LoginDataProvider {

    private WebDriver driver;

    @BeforeMethod
    public void setUp() {
        driver = new ChromeDriver();
        driver.get("https://example.com/login");
    }

    @Test(dataProvider = "loginData")
    public void testLogin(String username, String password,
                          boolean expectSuccess, String expectedMessage) {
        LoginPage loginPage = new LoginPage(driver);
        loginPage.enterUsername(username).enterPassword(password).clickLogin();

        if (expectSuccess) {
            DashboardPage dashboard = new DashboardPage(driver);
            Assert.assertTrue(dashboard.isLoaded());
            Assert.assertEquals(dashboard.getTitle(), expectedMessage);
        } else {
            Assert.assertTrue(loginPage.getErrorMessage().contains(expectedMessage));
        }
    }

    @AfterMethod
    public void tearDown() {
        if (driver != null) driver.quit();
    }
}`,
  },

  {
    id: 'sel-006',
    moduleId: 'selenium-webdriver',
    question: 'How do you handle frames and iframes in Selenium WebDriver?',
    answer: `Frames (or iframes) are separate HTML documents embedded within the main page. WebDriver cannot directly interact with elements inside a frame without switching context first.

**Switching to a frame:**
\`\`\`java
// By index (0-based)
driver.switchTo().frame(0);

// By name or id attribute
driver.switchTo().frame("frameName");
driver.switchTo().frame("frameId");

// By WebElement (most robust)
WebElement iframe = driver.findElement(By.cssSelector("iframe.content-frame"));
driver.switchTo().frame(iframe);
\`\`\`

**Switching back to the main document:**
\`\`\`java
driver.switchTo().defaultContent(); // back to top-level page
driver.switchTo().parentFrame();    // back to immediate parent frame
\`\`\`

**Nested frames:**
You must switch into each frame level in sequence.
\`\`\`java
driver.switchTo().frame("outerFrame");
driver.switchTo().frame("innerFrame");
// interact with inner frame elements
driver.switchTo().defaultContent(); // jump all the way out
\`\`\`

**Best practice:**
1. Always switch back to defaultContent after you are done.
2. Use explicit waits before switching — the iframe must be present in the DOM.
3. If an iframe loads dynamically, wait for it: \`wait.until(ExpectedConditions.frameToBeAvailableAndSwitchToIt(By.id("myFrame")))\``,
    level: 'intermediate',
    tags: ['selenium', 'iframe', 'frames', 'switchTo', 'context'],
  },

  // ---- ADVANCED --------------------------------------------

  {
    id: 'sel-007',
    moduleId: 'selenium-webdriver',
    question: 'How do you set up and use Selenium Grid for parallel test execution?',
    answer: `**Selenium Grid** allows you to run tests in parallel on multiple machines and browsers, drastically reducing total execution time.

**Architecture (Grid 4):**
- **Hub** (now called **Router/Distributor**) — receives test requests and routes them to the appropriate node.
- **Nodes** — machines with browsers installed that actually execute the tests.

**Setting up Grid 4 (Standalone mode — simplest):**
\`\`\`bash
# Download selenium-server-4.x.x.jar
java -jar selenium-server-4.x.x.jar standalone --port 4444
\`\`\`

**Hub + Node mode:**
\`\`\`bash
# On Hub machine
java -jar selenium-server.jar hub

# On Node machine
java -jar selenium-server.jar node --hub http://hub-ip:4444
\`\`\`

**Connecting tests to Grid:**
\`\`\`java
ChromeOptions options = new ChromeOptions();
WebDriver driver = new RemoteWebDriver(
    new URL("http://hub-ip:4444/wd/hub"), options
);
\`\`\`

**Parallel execution with TestNG:**
Configure \`testng.xml\` with \`parallel="tests"\` or \`parallel="methods"\` and set \`thread-count\`.
Use \`ThreadLocal<WebDriver>\` to keep driver instances isolated per thread.

**Docker Grid:**
\`\`\`bash
docker-compose up -d  # using Selenium's official docker-compose.yml
\`\`\`
Supports auto-scaling nodes. Best for CI/CD pipelines.`,
    level: 'advanced',
    tags: ['selenium', 'grid', 'parallel', 'RemoteWebDriver', 'hub', 'node'],
    codeExample: `// BaseTest.java using ThreadLocal for thread-safe Grid execution
public class BaseTest {

    private static final ThreadLocal<WebDriver> driverThread = new ThreadLocal<>();
    private static final String GRID_URL = "http://grid-hub:4444/wd/hub";

    @BeforeMethod
    @Parameters({"browser"})
    public void setUp(@Optional("chrome") String browser) throws MalformedURLException {
        MutableCapabilities capabilities;

        switch (browser.toLowerCase()) {
            case "firefox":
                capabilities = new FirefoxOptions();
                break;
            case "edge":
                capabilities = new EdgeOptions();
                break;
            default:
                capabilities = new ChromeOptions();
        }

        WebDriver driver = new RemoteWebDriver(new URL(GRID_URL), capabilities);
        driver.manage().window().maximize();
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(5));
        driverThread.set(driver);
    }

    public static WebDriver getDriver() {
        return driverThread.get();
    }

    @AfterMethod(alwaysRun = true)
    public void tearDown() {
        WebDriver driver = driverThread.get();
        if (driver != null) {
            driver.quit();
            driverThread.remove();
        }
    }
}`,
  },

  {
    id: 'sel-008',
    moduleId: 'selenium-webdriver',
    question: 'Explain dynamic XPath patterns. Write XPath to handle complex element identification.',
    answer: `**Dynamic XPath** patterns use XPath axes, functions, and attributes to locate elements that lack stable IDs or names.

**Key XPath functions:**
- \`contains(attr, value)\` — partial attribute match: \`//button[contains(@class,'submit')]\`
- \`starts-with(attr, value)\` — attribute prefix match: \`//input[starts-with(@id,'user_')]\`
- \`text()\` — match by visible text: \`//h2[text()='Welcome']\`
- \`normalize-space()\` — ignore leading/trailing whitespace: \`//span[normalize-space()='Click Here']\`
- \`not()\` — negation: \`//input[not(@disabled)]\`

**XPath Axes:**
- \`parent::\` — select parent: \`//span[@class='error']/parent::div\`
- \`ancestor::\` — any ancestor: \`//input[@id='qty']/ancestor::form\`
- \`following-sibling::\` — next sibling: \`//label[text()='Email']/following-sibling::input\`
- \`preceding-sibling::\` — previous sibling
- \`following::\` — any element after in DOM
- \`child::\` — direct children

**Positional:**
- \`(//div[@class='item'])[3]\` — third matching element
- \`//ul/li[last()]\` — last list item
- \`//table/tbody/tr[position() > 1]\` — all rows except header

**Dynamic ID handling:**
\`//button[starts-with(@id,'btn_') and contains(@class,'primary')]\``,
    level: 'advanced',
    tags: ['xpath', 'dynamic', 'axes', 'locators', 'selenium'],
  },

  {
    id: 'sel-009',
    moduleId: 'selenium-webdriver',
    question: 'How do you handle StaleElementReferenceException? Write a robust retry utility.',
    answer: `**StaleElementReferenceException** is thrown when a WebElement reference becomes invalid because the DOM was updated after the element was found. This is common with:
- AJAX page updates that re-render elements
- Navigation causing page reload
- JavaScript frameworks (React, Angular, Vue) that re-render components

**Root causes:**
1. Element was found, then page partially reloaded.
2. Element was inside a DOM fragment that was replaced.
3. NavigatingBack/Forward invalidated the reference.

**Solutions:**

**1. Re-find the element before every interaction:**
Never store WebElement references as class-level fields for long-lived objects.

**2. Use explicit waits with staleness checks:**
\`wait.until(ExpectedConditions.refreshed(ExpectedConditions.elementToBeClickable(By.id("btn"))))\`

**3. Retry mechanism** — most robust for unpredictable apps:

**4. Store the By locator, not the WebElement:**
Store \`By locator = By.id("btn")\` and call \`driver.findElement(locator)\` at point of use.`,
    level: 'advanced',
    tags: ['StaleElementReferenceException', 'selenium', 'exception', 'retry', 'dynamic'],
    codeExample: `// RetryUtils.java — generic retry for stale element scenarios
public class RetryUtils {

    private static final int MAX_RETRIES = 3;
    private static final long RETRY_DELAY_MS = 500;

    /**
     * Retries a Supplier action up to MAX_RETRIES times on StaleElementReferenceException.
     */
    public static <T> T retryOnStale(Supplier<T> action) {
        int attempt = 0;
        while (true) {
            try {
                return action.get();
            } catch (StaleElementReferenceException e) {
                attempt++;
                if (attempt >= MAX_RETRIES) {
                    throw new RuntimeException("Action failed after " + MAX_RETRIES + " retries due to stale element", e);
                }
                try { Thread.sleep(RETRY_DELAY_MS); } catch (InterruptedException ie) { Thread.currentThread().interrupt(); }
            }
        }
    }

    /**
     * Retries a click action by re-locating the element each time.
     */
    public static void retryClick(WebDriver driver, By locator) {
        retryOnStale(() -> {
            driver.findElement(locator).click();
            return null;
        });
    }
}

// Usage in a Page class
public class ProductPage extends BasePage {
    private final By addToCartBtn = By.cssSelector(".add-to-cart");

    public CartPage addToCart() {
        // Framework re-renders the button after loading price — stale element risk
        RetryUtils.retryOnStale(() -> {
            wait.until(ExpectedConditions.elementToBeClickable(addToCartBtn)).click();
            return null;
        });
        return new CartPage(driver);
    }
}`,
  },

  // ---- SCENARIO --------------------------------------------

  {
    id: 'sel-010',
    moduleId: 'selenium-webdriver',
    question: 'Scenario: A test that clicks a "Load More" button intermittently fails. The button is sometimes not visible, sometimes not clickable, and sometimes causes a StaleElementReferenceException. How do you handle this?',
    answer: `This is a classic **intermittent failure** caused by timing and DOM instability. A layered defense strategy is needed:

**Step 1 — Diagnose the root causes:**
- Button not visible → element loads asynchronously (AJAX).
- Button not clickable → another element (overlay, spinner) is covering it.
- StaleElementReferenceException → DOM re-renders after initial find.

**Step 2 — Apply explicit waits with the RIGHT condition:**
\`\`\`java
WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(15));
// Wait for spinner to disappear first
wait.until(ExpectedConditions.invisibilityOfElementLocated(By.id("spinner")));
// Then wait for button to be clickable (not just visible)
WebElement btn = wait.until(ExpectedConditions.elementToBeClickable(By.id("loadMoreBtn")));
\`\`\`

**Step 3 — Scroll into view before clicking:**
Elements at the bottom of the page might not be in viewport. Use JS scroll:
\`\`\`java
((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", btn);
\`\`\`

**Step 4 — Handle StaleElementReferenceException with retry:**
Use the retryOnStale utility — re-locate the element on each retry.

**Step 5 — Use JavascriptExecutor as fallback:**
If native click fails (intercepted click), use JS click:
\`\`\`java
((JavascriptExecutor) driver).executeScript("arguments[0].click();", btn);
\`\`\`

**Step 6 — Add screenshot/logging on failure:**
Attach screenshots in TestNG \`@AfterMethod\` or ITestListener to capture the state.

**Root-cause reporting:** Flag this to the dev team — a loading spinner that doesn't reliably mask UI elements is a bug.`,
    level: 'scenario',
    tags: ['intermittent', 'flaky-test', 'synchronization', 'scenario', 'best-practices'],
  },

  {
    id: 'sel-011',
    moduleId: 'selenium-webdriver',
    question: 'Scenario: You need to automate a multi-tab workflow where clicking a link opens a new browser tab and you must interact with it. How do you implement this?',
    answer: `Selenium WebDriver handles windows and tabs through **window handles** — unique string identifiers assigned to each window/tab.

**Algorithm:**
1. Record the current window handle before the action.
2. Perform the action that opens a new tab.
3. Wait until the new handle appears in the handle set.
4. Switch to the new handle.
5. Interact with the new tab.
6. Close the tab if needed, then switch back.

**Implementation:**
\`\`\`java
public class MultiTabPage extends BasePage {

    public void handleNewTabWorkflow() {
        // 1. Capture original handle
        String originalHandle = driver.getWindowHandle();

        // 2. Click the link that opens a new tab
        driver.findElement(By.linkText("Open Report")).click();

        // 3. Wait for the new tab to open
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        wait.until(driver -> driver.getWindowHandles().size() > 1);

        // 4. Switch to the new tab
        for (String handle : driver.getWindowHandles()) {
            if (!handle.equals(originalHandle)) {
                driver.switchTo().window(handle);
                break;
            }
        }

        // 5. Interact with the new tab
        wait.until(ExpectedConditions.titleContains("Report"));
        String reportTitle = driver.getTitle();
        Assert.assertTrue(reportTitle.contains("Report"));

        // 6. Close new tab and return to original
        driver.close();
        driver.switchTo().window(originalHandle);
    }
}
\`\`\`

**Important notes:**
- \`driver.getWindowHandle()\` returns the CURRENT window handle.
- \`driver.getWindowHandles()\` returns ALL open handles (as Set — no guaranteed order).
- After closing a tab, always switch back explicitly — the driver has no active window.`,
    level: 'scenario',
    tags: ['multi-tab', 'window-handles', 'switchTo', 'selenium', 'scenario'],
  },

  // ---- CODING ----------------------------------------------

  {
    id: 'sel-012',
    moduleId: 'selenium-webdriver',
    question: 'Write a complete Selenium test using POM to login and verify the dashboard.',
    answer: `Below is a production-ready POM implementation with full login flow and assertion. See code example for full implementation.`,
    level: 'coding',
    tags: ['selenium', 'POM', 'coding', 'login', 'TestNG'],
    codeExample: `// ── LoginPage.java ──────────────────────────────────────────
import org.openqa.selenium.*;
import org.openqa.selenium.support.*;
import org.openqa.selenium.support.ui.*;
import java.time.Duration;

public class LoginPage {
    private final WebDriver driver;
    private final WebDriverWait wait;

    @FindBy(id = "username")        private WebElement usernameInput;
    @FindBy(id = "password")        private WebElement passwordInput;
    @FindBy(css = "button[type='submit']") private WebElement submitBtn;
    @FindBy(css = ".error-message") private WebElement errorMessage;

    public LoginPage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        PageFactory.initElements(driver, this);
    }

    public LoginPage open(String baseUrl) {
        driver.get(baseUrl + "/login");
        return this;
    }

    public DashboardPage loginWith(String username, String password) {
        wait.until(ExpectedConditions.visibilityOf(usernameInput));
        usernameInput.clear();
        usernameInput.sendKeys(username);
        passwordInput.clear();
        passwordInput.sendKeys(password);
        submitBtn.click();
        return new DashboardPage(driver);
    }

    public String getError() {
        return wait.until(ExpectedConditions.visibilityOf(errorMessage)).getText();
    }
}

// ── DashboardPage.java ───────────────────────────────────────
public class DashboardPage {
    private final WebDriver driver;
    private final WebDriverWait wait;

    @FindBy(css = "h1.dashboard-title") private WebElement dashboardTitle;
    @FindBy(id = "user-greeting")       private WebElement userGreeting;
    @FindBy(css = ".logout-btn")        private WebElement logoutBtn;

    public DashboardPage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        PageFactory.initElements(driver, this);
    }

    public boolean isLoaded() {
        try {
            wait.until(ExpectedConditions.visibilityOf(dashboardTitle));
            return dashboardTitle.isDisplayed();
        } catch (TimeoutException e) {
            return false;
        }
    }

    public String getGreeting() {
        return wait.until(ExpectedConditions.visibilityOf(userGreeting)).getText();
    }

    public String getTitle() {
        return dashboardTitle.getText();
    }
}

// ── LoginTest.java ────────────────────────────────────────────
import org.testng.annotations.*;
import org.testng.*;
import io.github.bonigarcia.wdm.WebDriverManager;

public class LoginTest {
    private WebDriver driver;
    private static final String BASE_URL = "https://example.com";

    @BeforeMethod
    public void setUp() {
        WebDriverManager.chromedriver().setup();
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--headless=new", "--no-sandbox", "--disable-dev-shm-usage");
        driver = new ChromeDriver(options);
        driver.manage().window().maximize();
    }

    @Test(priority = 1, description = "Verify successful login redirects to dashboard")
    public void testSuccessfulLogin() {
        DashboardPage dashboard = new LoginPage(driver)
            .open(BASE_URL)
            .loginWith("testuser@example.com", "SecurePass123!");

        Assert.assertTrue(dashboard.isLoaded(), "Dashboard should be displayed after login");
        Assert.assertTrue(dashboard.getGreeting().contains("testuser"),
            "Greeting should contain the username");
        Assert.assertEquals(dashboard.getTitle(), "My Dashboard");
    }

    @Test(priority = 2, description = "Verify error message on invalid credentials")
    public void testInvalidLogin() {
        LoginPage loginPage = new LoginPage(driver).open(BASE_URL);
        loginPage.loginWith("wrong@example.com", "badpass");

        Assert.assertEquals(loginPage.getError(), "Invalid email or password.",
            "Error message should appear for wrong credentials");
    }

    @AfterMethod(alwaysRun = true)
    public void tearDown() {
        if (driver != null) driver.quit();
    }
}`,
  },

  {
    id: 'sel-013',
    moduleId: 'selenium-webdriver',
    question: 'Write a utility to take screenshots and attach them to TestNG reports on test failure.',
    answer: `Implement the ITestListener interface and override onTestFailure to capture and attach screenshots. See code example.`,
    level: 'coding',
    tags: ['selenium', 'screenshot', 'TestNG', 'listener', 'reporting'],
    codeExample: `// ── ScreenshotListener.java ─────────────────────────────────
import org.openqa.selenium.*;
import org.testng.*;
import java.io.*;
import java.nio.file.*;
import java.time.*;
import java.time.format.*;

public class ScreenshotListener implements ITestListener {

    private static final String SCREENSHOT_DIR = "test-output/screenshots/";

    @Override
    public void onTestFailure(ITestResult result) {
        Object testInstance = result.getInstance();

        // Get driver from test instance via reflection
        try {
            java.lang.reflect.Field driverField =
                testInstance.getClass().getSuperclass().getDeclaredField("driver");
            driverField.setAccessible(true);
            WebDriver driver = (WebDriver) driverField.get(testInstance);

            if (driver != null) {
                String screenshotPath = captureScreenshot(driver, result.getName());
                // Attach to TestNG report
                Reporter.log("<a href='" + screenshotPath + "'>" +
                    "<img src='" + screenshotPath + "' height='200' width='300'/></a>");
            }
        } catch (Exception e) {
            Reporter.log("Could not capture screenshot: " + e.getMessage());
        }
    }

    private String captureScreenshot(WebDriver driver, String testName) {
        String timestamp = LocalDateTime.now()
            .format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
        String fileName = SCREENSHOT_DIR + testName + "_" + timestamp + ".png";

        try {
            Files.createDirectories(Paths.get(SCREENSHOT_DIR));
            File screenshot = ((TakesScreenshot) driver).getScreenshotAs(OutputType.FILE);
            Files.copy(screenshot.toPath(), Paths.get(fileName),
                StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            Reporter.log("Screenshot save failed: " + e.getMessage());
        }
        return fileName;
    }
}

// ── testng.xml ────────────────────────────────────────────────
// <listeners>
//   <listener class-name="com.example.listeners.ScreenshotListener"/>
// </listeners>`,
  },

  // ---- MCQ ------------------------------------------------

  {
    id: 'sel-014',
    moduleId: 'selenium-webdriver',
    question: 'Which method is used to switch to an iframe in Selenium WebDriver?',
    answer: `The correct answer is **a) driver.switchTo().frame()**. This method accepts an index (int), name/id (String), or WebElement. Option b) switchToFrame() does not exist. Option c) driver.frame() does not exist. Option d) is incorrect.`,
    level: 'mcq',
    tags: ['selenium', 'iframe', 'switchTo', 'mcq'],
    options: [
      'driver.switchTo().frame()',
      'driver.switchToFrame()',
      'driver.frame()',
      'driver.switchTo().iframe()',
    ],
    correctOption: 0,
  },

  {
    id: 'sel-015',
    moduleId: 'selenium-webdriver',
    question: 'Which of the following locators is the MOST preferred in Selenium for reliable element identification?',
    answer: `**b) By.id()** is the most preferred because IDs are supposed to be unique on a page and are the fastest to locate. However, when IDs are not available or are dynamic, cssSelector is the next best choice.`,
    level: 'mcq',
    tags: ['selenium', 'locators', 'best-practices', 'mcq'],
    options: [
      'By.xpath()',
      'By.id()',
      'By.className()',
      'By.tagName()',
    ],
    correctOption: 1,
  },

  {
    id: 'sel-016',
    moduleId: 'selenium-webdriver',
    question: 'What does driver.quit() do differently from driver.close()?',
    answer: `**d) driver.quit() closes all browser windows and ends the WebDriver session**, while driver.close() closes ONLY the current active window/tab. If there are multiple tabs open, close() will only close the focused one. quit() is the proper teardown method that also releases all resources.`,
    level: 'mcq',
    tags: ['selenium', 'driver', 'quit', 'close', 'mcq'],
    options: [
      'driver.quit() closes only the current tab',
      'driver.close() ends the WebDriver session',
      'They are identical',
      'driver.quit() closes all windows and ends the WebDriver session',
    ],
    correctOption: 3,
  },

  {
    id: 'sel-017',
    moduleId: 'selenium-webdriver',
    question: 'Which ExpectedCondition should you use to wait until an element is present in the DOM but may not be visible?',
    answer: `**a) presenceOfElementLocated** checks only that the element exists in the DOM (even if hidden). **visibilityOfElementLocated** requires it to be both in DOM and visible (non-zero dimensions). Use presence when working with hidden inputs or elements styled display:none.`,
    level: 'mcq',
    tags: ['selenium', 'explicit-wait', 'ExpectedConditions', 'mcq'],
    options: [
      'ExpectedConditions.presenceOfElementLocated()',
      'ExpectedConditions.visibilityOfElementLocated()',
      'ExpectedConditions.elementToBeClickable()',
      'ExpectedConditions.elementToBeSelected()',
    ],
    correctOption: 0,
  },

  // ---- RAPID-FIRE -----------------------------------------

  {
    id: 'sel-018',
    moduleId: 'selenium-webdriver',
    question: 'Rapid Fire: What is POM?',
    answer: `**Page Object Model** — a design pattern where each web page or component has a corresponding class that encapsulates the page's locators and actions, decoupling test logic from UI implementation details.`,
    level: 'rapid-fire',
    tags: ['selenium', 'POM', 'rapid-fire'],
  },

  {
    id: 'sel-019',
    moduleId: 'selenium-webdriver',
    question: 'Rapid Fire: What is the difference between findElement() and findElements()?',
    answer: `**findElement()** returns a single WebElement and throws NoSuchElementException if not found. **findElements()** returns a List<WebElement> and returns an EMPTY list (never throws) if no elements match.`,
    level: 'rapid-fire',
    tags: ['selenium', 'findElement', 'rapid-fire'],
  },

  {
    id: 'sel-020',
    moduleId: 'selenium-webdriver',
    question: 'Rapid Fire: What is implicit wait in Selenium?',
    answer: `A global timeout that tells WebDriver to poll the DOM up to N seconds before throwing NoSuchElementException on every findElement call. Set once with \`driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(N))\`.`,
    level: 'rapid-fire',
    tags: ['selenium', 'implicit-wait', 'rapid-fire'],
  },

  {
    id: 'sel-021',
    moduleId: 'selenium-webdriver',
    question: 'Rapid Fire: What is JavascriptExecutor used for in Selenium?',
    answer: `JavascriptExecutor allows executing arbitrary JavaScript code in the browser context. Common uses: scrolling, clicking hidden elements, setting input values directly, reading DOM properties, and handling elements that Selenium's native commands can't interact with.`,
    level: 'rapid-fire',
    tags: ['selenium', 'JavascriptExecutor', 'rapid-fire'],
  },

  {
    id: 'sel-022',
    moduleId: 'selenium-webdriver',
    question: 'Rapid Fire: What is the Actions class in Selenium?',
    answer: `The **Actions** class provides API for complex user interactions: mouse hover, drag-and-drop, right-click (contextClick), double-click, keyboard combinations, and click-and-hold. Actions are built as a chain and executed with \`.build().perform()\` or just \`.perform()\`.`,
    level: 'rapid-fire',
    tags: ['selenium', 'Actions', 'rapid-fire'],
  },

  {
    id: 'sel-023',
    moduleId: 'selenium-webdriver',
    question: 'How do you handle dropdowns in Selenium WebDriver?',
    answer: `Selenium provides the **Select** class for interacting with HTML \`<select>\` elements. It offers three selection methods and corresponding deselect methods.

For custom (non-native) dropdowns (React, Angular), use click-based interactions combined with explicit waits.`,
    level: 'intermediate',
    tags: ['selenium', 'dropdown', 'Select', 'form-elements'],
    codeExample: `// Native HTML <select> dropdown
Select dropdown = new Select(driver.findElement(By.id("country")));

// Select by visible text
dropdown.selectByVisibleText("United States");

// Select by value attribute
dropdown.selectByValue("US");

// Select by 0-based index
dropdown.selectByIndex(2);

// Check if multi-select
boolean isMulti = dropdown.isMultiple();

// Get all options
List<WebElement> allOptions = dropdown.getOptions();
allOptions.forEach(opt -> System.out.println(opt.getText()));

// Get currently selected
WebElement selected = dropdown.getFirstSelectedOption();
System.out.println("Selected: " + selected.getText());

// ─── Custom dropdown (non-native) ───────────────────────────
WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

// 1. Click to open
driver.findElement(By.css(".custom-select__trigger")).click();

// 2. Wait for options to appear
wait.until(ExpectedConditions.visibilityOfElementLocated(
    By.css(".custom-select__options")));

// 3. Click the desired option
driver.findElement(
    By.xpath("//li[contains(@class,'option') and text()='Canada']")
).click();`,
  },

  {
    id: 'sel-024',
    moduleId: 'selenium-webdriver',
    question: 'What is TestNG and how does it compare to JUnit?',
    answer: `**TestNG** (Test Next Generation) is a testing framework inspired by JUnit but with more powerful features for enterprise and automation testing.

**Advantages of TestNG over JUnit:**
1. **Groups** — tests can be categorized and run selectively (e.g., @Test(groups="smoke")).
2. **Dependencies** — \`dependsOnMethods\`/\`dependsOnGroups\` allow test ordering.
3. **DataProvider** — native parametrization returning Object[][].
4. **Parallel execution** — built-in at suite/test/class/method level in testng.xml.
5. **@BeforeSuite / @AfterSuite** — broader lifecycle hooks than JUnit.
6. **Listeners** — ITestListener, IReporter for custom reporting.
7. **HTML reports** — generated out-of-the-box.
8. **@Factory** — create test class instances dynamically.
9. **Soft assertions** — via SoftAssert class (does NOT stop test on first failure).

**JUnit 5 advantages:** Better lambda support, @ParameterizedTest, @Extension model, better IDE integration for unit testing.

For **SDET/QA automation**, TestNG is preferred due to its DataProvider, groups, and parallel execution features.`,
    level: 'basic',
    tags: ['TestNG', 'JUnit', 'testing-framework', 'comparison'],
  },

  {
    id: 'sel-025',
    moduleId: 'selenium-webdriver',
    question: 'How do you read test data from an Excel file and use it in a Selenium test with TestNG DataProvider?',
    answer: `Use Apache POI library to read Excel files. Combine it with TestNG @DataProvider for data-driven testing. See code example.`,
    level: 'intermediate',
    tags: ['selenium', 'excel', 'apache-poi', 'data-driven', 'DataProvider'],
    codeExample: `// pom.xml dependency
// <dependency>
//   <groupId>org.apache.poi</groupId>
//   <artifactId>poi-ooxml</artifactId>
//   <version>5.2.3</version>
// </dependency>

// ExcelUtils.java
public class ExcelUtils {

    public static Object[][] readExcelData(String filePath, String sheetName) {
        Object[][] data;
        try (FileInputStream fis = new FileInputStream(filePath);
             Workbook workbook = new XSSFWorkbook(fis)) {

            Sheet sheet = workbook.getSheet(sheetName);
            int rows = sheet.getPhysicalNumberOfRows();
            int cols = sheet.getRow(0).getPhysicalNumberOfCells();

            // Skip header row (start from index 1)
            data = new Object[rows - 1][cols];

            for (int i = 1; i < rows; i++) {
                Row row = sheet.getRow(i);
                for (int j = 0; j < cols; j++) {
                    Cell cell = row.getCell(j);
                    data[i - 1][j] = getCellValue(cell);
                }
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to read Excel: " + filePath, e);
        }
        return data;
    }

    private static String getCellValue(Cell cell) {
        if (cell == null) return "";
        return switch (cell.getCellType()) {
            case STRING  -> cell.getStringCellValue();
            case NUMERIC -> String.valueOf((long) cell.getNumericCellValue());
            case BOOLEAN -> String.valueOf(cell.getBooleanCellValue());
            default      -> "";
        };
    }
}

// LoginTest.java using Excel DataProvider
public class LoginExcelTest extends BaseTest {

    @DataProvider(name = "loginExcelData")
    public Object[][] loginData() {
        return ExcelUtils.readExcelData(
            "src/test/resources/testdata/LoginData.xlsx",
            "LoginTestData"
        );
    }

    @Test(dataProvider = "loginExcelData")
    public void testLoginWithExcelData(String username, String password, String expectedResult) {
        LoginPage loginPage = new LoginPage(getDriver()).open(BASE_URL);

        if ("success".equalsIgnoreCase(expectedResult)) {
            DashboardPage dashboard = loginPage.loginWith(username, password);
            Assert.assertTrue(dashboard.isLoaded(), "Dashboard should load for valid user: " + username);
        } else {
            loginPage.loginWith(username, password);
            Assert.assertFalse(loginPage.getError().isEmpty(), "Error should show for invalid user: " + username);
        }
    }
}`,
  },
];

// ============================================================
// MODULE 2 — rest-assured  (20 questions)
// ============================================================

const restAssuredQuestions: InterviewQuestion[] = [

  // ---- BASIC -----------------------------------------------

  {
    id: 'ra-001',
    moduleId: 'rest-assured',
    question: 'What is REST Assured, and what are its key features?',
    answer: `**REST Assured** is a Java DSL (Domain-Specific Language) library for testing RESTful web services. It simplifies HTTP request sending and response validation without needing to write low-level HTTP code.

**Key features:**
1. **BDD syntax** — given/when/then structure makes tests readable.
2. **JSON/XML parsing** — built-in support via JsonPath and XmlPath.
3. **Authentication** — supports Basic, OAuth 1.0/2.0, API Key, Bearer Token.
4. **Schema validation** — validate against JSON Schema or XML Schema.
5. **Multi-part form** — supports file upload via multiPart().
6. **Filters & Logging** — request/response logging, custom filters.
7. **TestNG/JUnit integration** — works with any Java test runner.
8. **Serialization/Deserialization** — supports Jackson, Gson for POJO mapping.
9. **Specification reuse** — RequestSpecification and ResponseSpecification for DRY tests.
10. **SSL support** — relaxed/custom SSL configuration.

**Dependency (Maven):**
\`\`\`xml
<dependency>
  <groupId>io.rest-assured</groupId>
  <artifactId>rest-assured</artifactId>
  <version>5.4.0</version>
  <scope>test</scope>
</dependency>
\`\`\``,
    level: 'basic',
    tags: ['rest-assured', 'API-testing', 'BDD', 'introduction'],
  },

  {
    id: 'ra-002',
    moduleId: 'rest-assured',
    question: 'Explain the given/when/then structure in REST Assured.',
    answer: `REST Assured follows the **BDD (Behavior-Driven Development)** pattern using given/when/then which maps directly to the Arrange/Act/Assert pattern:

**given()** — Set up request prerequisites:
- Headers, query parameters, path parameters
- Request body / payload
- Authentication credentials
- Base URI, base path, port
- Content-Type

**when()** — Execute the HTTP action:
- .get(path), .post(path), .put(path), .delete(path), .patch(path)

**then()** — Validate the response:
- Status code assertions
- Header assertions
- Body/field assertions via jsonPath/xmlPath
- Schema validation
- Extract response for further use

The structure makes tests self-documenting and maps directly to Gherkin-style test cases, making them accessible to non-developers as well.`,
    level: 'basic',
    tags: ['rest-assured', 'BDD', 'given-when-then', 'syntax'],
    codeExample: `import io.restassured.RestAssured;
import static io.restassured.RestAssured.*;
import static org.hamcrest.Matchers.*;

// Simple GET test
@Test
public void testGetUser() {
    given()
        .baseUri("https://jsonplaceholder.typicode.com")
        .header("Accept", "application/json")
        .queryParam("_limit", 5)
    .when()
        .get("/users")
    .then()
        .statusCode(200)
        .contentType(ContentType.JSON)
        .body("size()", equalTo(5))
        .body("[0].name", notNullValue())
        .body("[0].email", containsString("@"));
}

// POST test
@Test
public void testCreatePost() {
    String requestBody = """
        {
          "title": "foo",
          "body": "bar",
          "userId": 1
        }
        """;

    given()
        .baseUri("https://jsonplaceholder.typicode.com")
        .contentType(ContentType.JSON)
        .body(requestBody)
    .when()
        .post("/posts")
    .then()
        .statusCode(201)
        .body("title", equalTo("foo"))
        .body("id", notNullValue());
}`,
  },

  {
    id: 'ra-003',
    moduleId: 'rest-assured',
    question: 'What are the common HTTP status codes and what do they represent in API testing?',
    answer: `**2xx — Success:**
- 200 OK — Successful GET, PUT, PATCH
- 201 Created — Resource created (POST)
- 204 No Content — Successful DELETE (no body)
- 202 Accepted — Async operation started

**3xx — Redirection:**
- 301 Moved Permanently — Resource URL changed permanently
- 302 Found — Temporary redirect
- 304 Not Modified — Cached response is valid (ETag match)

**4xx — Client Errors:**
- 400 Bad Request — Malformed syntax, invalid body
- 401 Unauthorized — Missing or invalid authentication
- 403 Forbidden — Authenticated but lacks permission
- 404 Not Found — Resource doesn't exist
- 405 Method Not Allowed — Wrong HTTP verb
- 409 Conflict — State conflict (e.g., duplicate)
- 422 Unprocessable Entity — Validation errors on semantically correct body
- 429 Too Many Requests — Rate limiting

**5xx — Server Errors:**
- 500 Internal Server Error — Unhandled exception on server
- 502 Bad Gateway — Invalid response from upstream
- 503 Service Unavailable — Server down/overloaded
- 504 Gateway Timeout — Upstream server timed out

**In REST Assured, verify status codes:**
\`.then().statusCode(200)\` or \`.then().statusCode(anyOf(is(200), is(201)))\``,
    level: 'basic',
    tags: ['HTTP', 'status-codes', 'REST', 'API-testing'],
  },

  // ---- INTERMEDIATE ----------------------------------------

  {
    id: 'ra-004',
    moduleId: 'rest-assured',
    question: 'How do you use JsonPath in REST Assured to extract and assert nested JSON data?',
    answer: `**JsonPath** is a query language for JSON, similar to XPath for XML. REST Assured integrates Jayway's JsonPath library.

**Syntax basics:**
- \`$.field\` — root level field
- \`$.parent.child\` — nested field
- \`$.array[0]\` — first element
- \`$.array[*].field\` — field from all array elements
- \`$.array.find{it.age > 25}\` — GPath-style filtering (Groovy)
- \`$.array.size()\` — count of array elements

**In REST Assured assertions (Hamcrest):**
- \`body("user.name", equalTo("John"))\`
- \`body("items.size()", greaterThan(0))\`
- \`body("items[0].price", is(29.99f))\`
- \`body("items.name", hasItems("Apple", "Banana"))\`

**Extracting values for further use:**
\`\`\`java
String token = given()...when()...then()
    .extract().path("data.token");
\`\`\`

**Full extraction:**
\`\`\`java
Response response = given()...when().get("/users/1").andReturn();
JsonPath jsonPath = response.jsonPath();
String name = jsonPath.getString("name");
int id = jsonPath.getInt("id");
List<String> emails = jsonPath.getList("emails");
\`\`\``,
    level: 'intermediate',
    tags: ['rest-assured', 'JsonPath', 'extraction', 'assertions'],
    codeExample: `@Test
public void testComplexJsonPath() {
    // Sample API returns:
    // { "store": { "books": [
    //   {"title":"Book A","price":9.99,"author":"Alice"},
    //   {"title":"Book B","price":14.99,"author":"Bob"}
    // ], "totalBooks": 2 } }

    Response response =
    given()
        .baseUri("https://api.example.com")
        .header("Authorization", "Bearer " + getAuthToken())
    .when()
        .get("/store")
    .then()
        .statusCode(200)
        .body("store.totalBooks", equalTo(2))
        .body("store.books[0].title", equalTo("Book A"))
        .body("store.books.price", hasItems(9.99f, 14.99f))
        .body("store.books.findAll{it.price > 10}.title", hasItem("Book B"))
        .extract().response();

    // Extract for further assertions
    JsonPath jp = response.jsonPath();
    List<String> titles = jp.getList("store.books.title");
    Assert.assertEquals(titles.size(), 2);

    float avgPrice = jp.getList("store.books.price", Float.class)
        .stream()
        .reduce(0f, Float::sum) / titles.size();
    Assert.assertTrue(avgPrice > 10, "Average price should be above $10");
}`,
  },

  {
    id: 'ra-005',
    moduleId: 'rest-assured',
    question: 'How do you handle authentication in REST Assured? Explain Basic Auth, Bearer Token, and OAuth2.',
    answer: `REST Assured supports multiple authentication mechanisms:

**1. Basic Authentication:**
Encodes "username:password" in Base64 and sends in Authorization header.
\`\`\`java
given().auth().basic("username", "password")
\`\`\`
or:
\`\`\`java
given().header("Authorization", "Basic " + Base64.encode("user:pass"))
\`\`\`

**2. Bearer Token (most common for REST APIs):**
\`\`\`java
given().header("Authorization", "Bearer " + accessToken)
// or
given().auth().oauth2(accessToken)
\`\`\`

**3. OAuth 1.0:**
\`\`\`java
given().auth().oauth(consumerKey, consumerSecret, accessToken, secretToken)
\`\`\`

**4. OAuth 2.0 (full flow with token fetch):**
First obtain the token, then use it in subsequent requests.

**5. API Key:**
\`\`\`java
given().header("X-API-Key", apiKey)
// or as query param
given().queryParam("api_key", apiKey)
\`\`\`

**6. Digest Authentication:**
\`\`\`java
given().auth().digest("username", "password")
\`\`\`

**Best practice:** Store credentials in environment variables or a config file, never hardcoded.`,
    level: 'intermediate',
    tags: ['rest-assured', 'authentication', 'Basic-Auth', 'Bearer-Token', 'OAuth2'],
    codeExample: `// Full OAuth2 flow: get token then use it
public class AuthHelper {

    private static String cachedToken = null;

    public static String getOAuth2Token() {
        if (cachedToken != null) return cachedToken;

        cachedToken =
        given()
            .baseUri("https://auth.example.com")
            .contentType("application/x-www-form-urlencoded")
            .formParam("grant_type", "client_credentials")
            .formParam("client_id",  System.getenv("CLIENT_ID"))
            .formParam("client_secret", System.getenv("CLIENT_SECRET"))
            .formParam("scope", "read:users write:posts")
        .when()
            .post("/oauth/token")
        .then()
            .statusCode(200)
            .extract().path("access_token");

        return cachedToken;
    }
}

// Using the token
@Test
public void testProtectedEndpoint() {
    given()
        .baseUri("https://api.example.com")
        .auth().oauth2(AuthHelper.getOAuth2Token())
        .pathParam("userId", 42)
    .when()
        .get("/users/{userId}")
    .then()
        .statusCode(200)
        .body("id", equalTo(42));
}`,
  },

  {
    id: 'ra-006',
    moduleId: 'rest-assured',
    question: 'How do you use RequestSpecification and ResponseSpecification for reusable test setup?',
    answer: `**RequestSpecification** allows defining common request parameters once and reusing them across multiple tests — the DRY principle for API tests.

**ResponseSpecification** allows defining common assertions that apply to multiple endpoints.

**Benefits:**
- Eliminates boilerplate setup in every test
- Centralized configuration (base URL, auth, headers)
- Easy to maintain: change in one place
- Can be combined with per-test overrides

**Best practice:** Define specs in a @BeforeSuite method or a TestBase class and store them as static fields accessible to all test classes.`,
    level: 'intermediate',
    tags: ['rest-assured', 'RequestSpecification', 'ResponseSpecification', 'reusability'],
    codeExample: `// ApiTestBase.java
public class ApiTestBase {

    protected static RequestSpecification requestSpec;
    protected static ResponseSpecification responseSpec;

    @BeforeSuite
    public static void setupSpecifications() {

        requestSpec = new RequestSpecBuilder()
            .setBaseUri("https://api.example.com")
            .setBasePath("/v2")
            .setContentType(ContentType.JSON)
            .addHeader("Accept", "application/json")
            .addHeader("Authorization", "Bearer " + AuthHelper.getOAuth2Token())
            .setRelaxedHTTPSValidation()  // skip SSL cert validation in test env
            .log(LogDetail.ALL)           // log all requests
            .build();

        responseSpec = new ResponseSpecBuilder()
            .expectContentType(ContentType.JSON)
            .expectResponseTime(lessThan(3000L))  // performance SLA
            .expectHeader("X-Request-Id", notNullValue())
            .build();
    }
}

// UserApiTest.java
public class UserApiTest extends ApiTestBase {

    @Test
    public void testGetAllUsers() {
        given()
            .spec(requestSpec)          // reuse base setup
            .queryParam("page", 1)
            .queryParam("pageSize", 20)
        .when()
            .get("/users")
        .then()
            .spec(responseSpec)         // reuse base assertions
            .statusCode(200)
            .body("data.size()", lessThanOrEqualTo(20))
            .body("pagination.currentPage", equalTo(1));
    }

    @Test
    public void testGetUserById() {
        given()
            .spec(requestSpec)
            .pathParam("id", 1)
        .when()
            .get("/users/{id}")
        .then()
            .spec(responseSpec)
            .statusCode(200)
            .body("id", equalTo(1))
            .body("email", matchesPattern("^[\\w.-]+@[\\w.-]+\\.\\w{2,}$"));
    }
}`,
  },

  // ---- ADVANCED --------------------------------------------

  {
    id: 'ra-007',
    moduleId: 'rest-assured',
    question: 'How do you validate a JSON response against a JSON Schema in REST Assured?',
    answer: `JSON Schema validation ensures the API response structure conforms to a predefined contract. REST Assured supports this via the **rest-assured-json-schema-validator** module.

**Setup (pom.xml):**
\`\`\`xml
<dependency>
  <groupId>io.rest-assured</groupId>
  <artifactId>json-schema-validator</artifactId>
  <version>5.4.0</version>
</dependency>
\`\`\`

**Creating the schema file (src/test/resources/schemas/user-schema.json):**
Define required fields, data types, formats, and constraints using JSON Schema Draft-07.

**Key validation aspects:**
- \`type\` — validates data type (string, integer, boolean, array, object)
- \`required\` — lists mandatory fields
- \`properties\` — defines structure of object fields
- \`format\` — validates formats (email, uri, date-time)
- \`minimum/maximum\` — numeric constraints
- \`minLength/maxLength\` — string length constraints
- \`pattern\` — regex validation
- \`enum\` — value from allowed list

Schema validation is particularly valuable for **contract testing** between services.`,
    level: 'advanced',
    tags: ['rest-assured', 'JSON-schema', 'contract-testing', 'validation'],
    codeExample: `// src/test/resources/schemas/user-schema.json
/*
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["id", "name", "email", "role", "createdAt"],
  "properties": {
    "id":        { "type": "integer", "minimum": 1 },
    "name":      { "type": "string",  "minLength": 2, "maxLength": 100 },
    "email":     { "type": "string",  "format": "email" },
    "role":      { "type": "string",  "enum": ["admin", "user", "moderator"] },
    "active":    { "type": "boolean" },
    "createdAt": { "type": "string",  "format": "date-time" },
    "address": {
      "type": "object",
      "properties": {
        "street": { "type": "string" },
        "city":   { "type": "string" },
        "zip":    { "type": "string", "pattern": "^\\d{5}(-\\d{4})?$" }
      }
    }
  },
  "additionalProperties": false
}
*/

// UserSchemaValidationTest.java
import static io.restassured.module.jsv.JsonSchemaValidator.matchesJsonSchemaInClasspath;

public class UserSchemaValidationTest extends ApiTestBase {

    @Test(description = "Verify user response matches JSON schema contract")
    public void testUserResponseSchema() {
        given()
            .spec(requestSpec)
            .pathParam("id", 1)
        .when()
            .get("/users/{id}")
        .then()
            .statusCode(200)
            // Schema validation — catches any structural deviation
            .body(matchesJsonSchemaInClasspath("schemas/user-schema.json"));
    }

    @Test(description = "Verify users list items match schema")
    public void testUsersListSchema() {
        Response response = given()
            .spec(requestSpec)
        .when()
            .get("/users")
        .then()
            .statusCode(200)
            .extract().response();

        // Validate each item in the array
        List<Map<String, Object>> users = response.jsonPath().getList("data");
        Assert.assertFalse(users.isEmpty(), "Users list should not be empty");

        // Validate array schema
        response.then()
            .body("data", everyItem(notNullValue()))
            .body(matchesJsonSchemaInClasspath("schemas/users-list-schema.json"));
    }
}`,
  },

  {
    id: 'ra-008',
    moduleId: 'rest-assured',
    question: 'How do you perform CRUD operation testing with REST Assured? Write a complete test suite.',
    answer: `A complete CRUD test suite covers Create, Read, Update, and Delete operations, ideally using the output of one step as input for the next (chained tests). See code example for full implementation.`,
    level: 'advanced',
    tags: ['rest-assured', 'CRUD', 'advanced', 'chained-tests'],
    codeExample: `// CrudApiTest.java — end-to-end CRUD test for /api/v1/products
public class CrudApiTest extends ApiTestBase {

    private static Integer createdProductId;

    // CREATE
    @Test(priority = 1, description = "POST: Create a new product")
    public void testCreateProduct() {
        String payload = """
            {
              "name": "Test Widget",
              "price": 29.99,
              "category": "Electronics",
              "stock": 100
            }
            """;

        createdProductId =
        given()
            .spec(requestSpec)
            .body(payload)
        .when()
            .post("/products")
        .then()
            .statusCode(201)
            .body("name", equalTo("Test Widget"))
            .body("price", equalTo(29.99f))
            .body("id", notNullValue())
            .extract().path("id");

        Assert.assertNotNull(createdProductId, "Created product ID should not be null");
        System.out.println("Created product with ID: " + createdProductId);
    }

    // READ
    @Test(priority = 2, dependsOnMethods = "testCreateProduct",
          description = "GET: Retrieve the created product")
    public void testGetProduct() {
        given()
            .spec(requestSpec)
            .pathParam("id", createdProductId)
        .when()
            .get("/products/{id}")
        .then()
            .statusCode(200)
            .body("id", equalTo(createdProductId))
            .body("name", equalTo("Test Widget"))
            .body("price", equalTo(29.99f));
    }

    // UPDATE
    @Test(priority = 3, dependsOnMethods = "testGetProduct",
          description = "PUT: Update the product")
    public void testUpdateProduct() {
        String updatePayload = """
            {
              "name": "Updated Widget Pro",
              "price": 49.99,
              "category": "Electronics",
              "stock": 150
            }
            """;

        given()
            .spec(requestSpec)
            .pathParam("id", createdProductId)
            .body(updatePayload)
        .when()
            .put("/products/{id}")
        .then()
            .statusCode(200)
            .body("name", equalTo("Updated Widget Pro"))
            .body("price", equalTo(49.99f))
            .body("stock", equalTo(150));
    }

    // PARTIAL UPDATE
    @Test(priority = 4, dependsOnMethods = "testUpdateProduct",
          description = "PATCH: Partially update the product price")
    public void testPatchProduct() {
        given()
            .spec(requestSpec)
            .pathParam("id", createdProductId)
            .body("{\"price\": 39.99}")
        .when()
            .patch("/products/{id}")
        .then()
            .statusCode(200)
            .body("price", equalTo(39.99f))
            .body("name", equalTo("Updated Widget Pro")); // unchanged
    }

    // DELETE
    @Test(priority = 5, dependsOnMethods = "testPatchProduct",
          description = "DELETE: Remove the product")
    public void testDeleteProduct() {
        given()
            .spec(requestSpec)
            .pathParam("id", createdProductId)
        .when()
            .delete("/products/{id}")
        .then()
            .statusCode(204); // No Content

        // Verify it's gone
        given()
            .spec(requestSpec)
            .pathParam("id", createdProductId)
        .when()
            .get("/products/{id}")
        .then()
            .statusCode(404)
            .body("error", equalTo("Product not found"));
    }
}`,
  },

  {
    id: 'ra-009',
    moduleId: 'rest-assured',
    question: 'How do you serialize and deserialize POJOs in REST Assured using Jackson?',
    answer: `REST Assured integrates with Jackson and Gson for automatic Java object serialization to JSON (request body) and deserialization from JSON (response body).

**Maven dependency:**
\`\`\`xml
<dependency>
  <groupId>io.rest-assured</groupId>
  <artifactId>rest-assured</artifactId>
  <version>5.4.0</version>
</dependency>
<!-- Jackson is pulled in transitively, or add explicitly: -->
<dependency>
  <groupId>com.fasterxml.jackson.core</groupId>
  <artifactId>jackson-databind</artifactId>
  <version>2.15.0</version>
</dependency>
\`\`\`

**Key benefits:**
- No manual JSON string construction
- Compile-time type safety
- Refactoring-safe (field renames caught by compiler)
- Easy to maintain when API contracts change`,
    level: 'intermediate',
    tags: ['rest-assured', 'POJO', 'Jackson', 'serialization', 'deserialization'],
    codeExample: `// User.java POJO
@JsonIgnoreProperties(ignoreUnknown = true)
public class User {
    private int id;
    private String name;
    private String email;
    private String role;

    // Getters and setters (or use Lombok @Data)
    public int getId() { return id; }
    public String getName() { return name; }
    // ...
}

// CreateUserRequest.java
public class CreateUserRequest {
    private String name;
    private String email;
    private String password;
    private String role;

    public CreateUserRequest(String name, String email, String password, String role) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
    }
    // Getters required for Jackson serialization
}

// PojoSerializationTest.java
public class PojoSerializationTest extends ApiTestBase {

    @Test(description = "POST with POJO body serialized to JSON by Jackson")
    public void testCreateUserWithPojo() {
        CreateUserRequest newUser = new CreateUserRequest(
            "Jane Doe", "jane@example.com", "SecurePass!", "user"
        );

        // Jackson auto-serializes POJO to JSON
        User createdUser =
        given()
            .spec(requestSpec)
            .body(newUser)  // Jackson serializes this
        .when()
            .post("/users")
        .then()
            .statusCode(201)
            .extract().as(User.class);  // Jackson deserializes response

        Assert.assertEquals(createdUser.getName(), "Jane Doe");
        Assert.assertEquals(createdUser.getEmail(), "jane@example.com");
        Assert.assertTrue(createdUser.getId() > 0);
    }

    @Test(description = "GET list and deserialize to List<User>")
    public void testGetUsersAsList() {
        List<User> users =
        given()
            .spec(requestSpec)
        .when()
            .get("/users")
        .then()
            .statusCode(200)
            .extract().jsonPath().getList("data", User.class);

        Assert.assertFalse(users.isEmpty());
        users.forEach(u -> Assert.assertNotNull(u.getEmail()));
    }
}`,
  },

  // ---- SCENARIO --------------------------------------------

  {
    id: 'ra-010',
    moduleId: 'rest-assured',
    question: 'Scenario: How would you design an API test framework with REST Assured for a large project with 200+ endpoints?',
    answer: `For a large-scale API test framework, apply these architectural decisions:

**1. Layered Architecture:**
- **Config Layer** — properties files, environment-specific base URLs, credential vaults.
- **Client Layer** — one class per API resource (UserApiClient, ProductApiClient). Each method wraps a specific endpoint.
- **Test Layer** — focused tests that call client methods, contain only assertions.
- **Model Layer** — POJOs for request/response bodies.
- **Utility Layer** — AuthHelper, DataFactory, SchemaValidator.

**2. Specification Reuse:**
Centralized RequestSpecification in a BaseTest class shared across all test classes.

**3. Configuration Management:**
Use a config.properties or YAML file per environment (dev, staging, prod). Read with:
\`\`\`java
Properties props = new Properties();
props.load(getClass().getResourceAsStream("/config/" + env + ".properties"));
\`\`\`

**4. Test Data Management:**
- Faker library for generating random test data.
- Dedicated data setup/teardown per test class.
- Avoid shared mutable state between tests.

**5. Reporting:**
- Allure or ExtentReports integration.
- Log all requests/responses on failure.

**6. CI/CD:**
- Maven profiles for environment selection: \`mvn test -Denv=staging -Dgroups=smoke\`
- Parallel test execution via TestNG's parallel="methods".`,
    level: 'scenario',
    tags: ['rest-assured', 'framework-design', 'architecture', 'scenario'],
  },

  {
    id: 'ra-011',
    moduleId: 'rest-assured',
    question: 'Scenario: An API endpoint returns different response structures based on query parameters. How do you handle this in your test?',
    answer: `When an API has conditional response schemas, the test must be structured to handle both branches explicitly.

**Strategy 1 — Separate test cases per scenario:**
Write dedicated test methods for each parameter combination. Clearest approach but can be verbose.

**Strategy 2 — DataProvider with expected schema path:**
\`\`\`java
@DataProvider
public Object[][] queryParamData() {
    return new Object[][] {
        {"format=simple",   "schemas/simple-response.json"},
        {"format=detailed", "schemas/detailed-response.json"},
        {"format=minimal",  "schemas/minimal-response.json"},
    };
}
\`\`\`

**Strategy 3 — Conditional assertions within one test:**
\`\`\`java
if (response.jsonPath().get("data.type") != null) {
    // validate detailed structure
} else {
    // validate simple structure
}
\`\`\`
→ Avoid this — it leads to complex, hard-to-read tests.

**Strategy 4 — Schema validation per param:**
Each query param combination maps to a distinct schema file. Use schema validation to cover all field assertions automatically.

**Best Practice:** Prefer Strategy 1 or 2. Each test should have a single, clear purpose. Complex conditional logic in test code is a code smell.`,
    level: 'scenario',
    tags: ['rest-assured', 'conditional-response', 'scenario', 'dynamic-schema'],
  },

  // ---- CODING ----------------------------------------------

  {
    id: 'ra-012',
    moduleId: 'rest-assured',
    question: 'Write a REST Assured test for a paginated API endpoint that validates all pages.',
    answer: `Test that iterates through all pages of a paginated API, accumulating and validating data. See code example.`,
    level: 'coding',
    tags: ['rest-assured', 'pagination', 'coding'],
    codeExample: `@Test(description = "Validate paginated API — iterate all pages and verify data integrity")
public void testPaginatedEndpoint() {
    int currentPage = 1;
    int totalPages;
    List<Integer> allUserIds = new ArrayList<>();

    do {
        Response response =
        given()
            .spec(requestSpec)
            .queryParam("page", currentPage)
            .queryParam("per_page", 10)
        .when()
            .get("/users")
        .then()
            .statusCode(200)
            .body("data", notNullValue())
            .body("pagination.currentPage", equalTo(currentPage))
            .body("data.size()", lessThanOrEqualTo(10))
            .extract().response();

        JsonPath jp = response.jsonPath();
        totalPages = jp.getInt("pagination.totalPages");
        int totalCount = jp.getInt("pagination.totalCount");

        // Validate meta on first page
        if (currentPage == 1) {
            Assert.assertTrue(totalCount > 0, "Total count should be positive");
            Assert.assertTrue(totalPages > 0, "Total pages should be positive");
        }

        // Collect IDs and verify uniqueness within page
        List<Integer> pageIds = jp.getList("data.id", Integer.class);
        Assert.assertEquals(new HashSet<>(pageIds).size(), pageIds.size(),
            "IDs on page " + currentPage + " should be unique");

        allUserIds.addAll(pageIds);
        currentPage++;

    } while (currentPage <= totalPages);

    // Verify no duplicate IDs across ALL pages
    Assert.assertEquals(new HashSet<>(allUserIds).size(), allUserIds.size(),
        "All user IDs across all pages should be unique");

    System.out.printf("Validated %d users across %d pages%n",
        allUserIds.size(), totalPages);
}`,
  },

  {
    id: 'ra-013',
    moduleId: 'rest-assured',
    question: 'How do you test file upload with REST Assured (multipart/form-data)?',
    answer: `File upload uses HTTP multipart/form-data content type. REST Assured provides the multiPart() method.`,
    level: 'coding',
    tags: ['rest-assured', 'file-upload', 'multipart', 'coding'],
    codeExample: `@Test(description = "Test file upload endpoint with multipart/form-data")
public void testFileUpload() throws URISyntaxException {
    File uploadFile = new File(
        getClass().getClassLoader().getResource("testfiles/sample.pdf").toURI()
    );

    Assert.assertTrue(uploadFile.exists(), "Test file must exist");

    given()
        .spec(requestSpec)
        .contentType("multipart/form-data")
        .multiPart("file", uploadFile, "application/pdf")
        .multiPart("description", "Sample test document")
        .multiPart("category", "reports")
        .formParam("userId", "42")
    .when()
        .post("/documents/upload")
    .then()
        .statusCode(201)
        .body("fileName", equalTo("sample.pdf"))
        .body("fileSize", greaterThan(0))
        .body("mimeType", equalTo("application/pdf"))
        .body("documentId", notNullValue())
        .body("uploadedAt", notNullValue());
}

// Test file download
@Test(description = "Test file download and verify content")
public void testFileDownload() {
    byte[] fileBytes =
    given()
        .spec(requestSpec)
        .pathParam("documentId", "doc-123")
        .accept("application/pdf")
    .when()
        .get("/documents/{documentId}/download")
    .then()
        .statusCode(200)
        .contentType("application/pdf")
        .header("Content-Disposition", containsString("attachment"))
        .extract().asByteArray();

    Assert.assertTrue(fileBytes.length > 0, "Downloaded file should not be empty");

    // Verify PDF magic bytes (PDF signature: %PDF-)
    String pdfHeader = new String(fileBytes, 0, 4);
    Assert.assertEquals(pdfHeader, "%PDF", "File should be a valid PDF");
}`,
  },

  // ---- MCQ ------------------------------------------------

  {
    id: 'ra-014',
    moduleId: 'rest-assured',
    question: 'In REST Assured, which class is used to define reusable request configurations?',
    answer: `**b) RequestSpecBuilder** is used to build a reusable RequestSpecification via the builder pattern. \`new RequestSpecBuilder().setBaseUri(...).build()\` produces a RequestSpecification that can be passed to \`given().spec(...)\`.`,
    level: 'mcq',
    tags: ['rest-assured', 'RequestSpecBuilder', 'mcq'],
    options: [
      'RestAssuredConfig',
      'RequestSpecBuilder',
      'ResponseSpecBuilder',
      'ApiConfig',
    ],
    correctOption: 1,
  },

  {
    id: 'ra-015',
    moduleId: 'rest-assured',
    question: 'Which method in REST Assured is used to extract a value from the JSON response for use in subsequent tests?',
    answer: `**c) extract().path("field")** is used to extract specific values. The full chain is: \`.then().extract().path("fieldName")\`. You can also use \`.extract().response()\` to get the full Response object and then call \`response.jsonPath().get("field")\`.`,
    level: 'mcq',
    tags: ['rest-assured', 'extract', 'mcq'],
    options: [
      '.body("field").get()',
      '.response().get("field")',
      '.extract().path("field")',
      '.jsonPath("field")',
    ],
    correctOption: 2,
  },

  {
    id: 'ra-016',
    moduleId: 'rest-assured',
    question: 'What is the correct HTTP method and expected status code for creating a new resource in a REST API?',
    answer: `**b) POST with 201 Created**. POST is the standard method for resource creation. The response should include the created resource (or at minimum its ID) and return status 201. The Location header often contains the URL of the newly created resource.`,
    level: 'mcq',
    tags: ['rest-assured', 'HTTP-methods', 'status-codes', 'mcq'],
    options: [
      'PUT with 200 OK',
      'POST with 201 Created',
      'GET with 200 OK',
      'POST with 200 OK',
    ],
    correctOption: 1,
  },

  {
    id: 'ra-017',
    moduleId: 'rest-assured',
    question: 'Which dependency enables JSON Schema validation in REST Assured?',
    answer: `**a) rest-assured json-schema-validator**. Add the dependency \`io.rest-assured:json-schema-validator\` and import \`JsonSchemaValidator.matchesJsonSchemaInClasspath()\` to validate response bodies against a schema file.`,
    level: 'mcq',
    tags: ['rest-assured', 'json-schema-validator', 'dependencies', 'mcq'],
    options: [
      'io.rest-assured:json-schema-validator',
      'com.fasterxml.jackson.core:jackson-databind',
      'org.everit.json:org.everit.json.schema',
      'io.rest-assured:rest-assured-all',
    ],
    correctOption: 0,
  },

  // ---- RAPID-FIRE -----------------------------------------

  {
    id: 'ra-018',
    moduleId: 'rest-assured',
    question: 'Rapid Fire: What is the difference between PUT and PATCH HTTP methods?',
    answer: `**PUT** replaces the ENTIRE resource. If you omit a field, it gets nulled out. **PATCH** performs a PARTIAL update — only specified fields are changed, others remain unchanged. Use PUT for complete updates, PATCH for partial modifications.`,
    level: 'rapid-fire',
    tags: ['REST', 'HTTP-methods', 'PUT', 'PATCH', 'rapid-fire'],
  },

  {
    id: 'ra-019',
    moduleId: 'rest-assured',
    question: 'Rapid Fire: What is idempotency in REST APIs?',
    answer: `An operation is **idempotent** if calling it multiple times produces the same result as calling it once. GET, PUT, DELETE are idempotent. POST is NOT idempotent (each call creates a new resource). PATCH may or may not be idempotent depending on implementation.`,
    level: 'rapid-fire',
    tags: ['REST', 'idempotency', 'rapid-fire'],
  },

  {
    id: 'ra-020',
    moduleId: 'rest-assured',
    question: 'Rapid Fire: What is the use of Content-Type vs Accept headers?',
    answer: `**Content-Type** tells the server what format the REQUEST BODY is in (e.g., \`application/json\`). **Accept** tells the server what format the CLIENT WANTS in the response (e.g., \`application/json\`). If the server can't match Accept, it returns 406 Not Acceptable.`,
    level: 'rapid-fire',
    tags: ['REST', 'headers', 'Content-Type', 'Accept', 'rapid-fire'],
  },
];

// ============================================================
// MODULE 3 — appium  (8 questions)
// ============================================================

const appiumQuestions: InterviewQuestion[] = [

  {
    id: 'app-001',
    moduleId: 'appium',
    question: 'What is Appium and how does it work under the hood?',
    answer: `**Appium** is an open-source, cross-platform mobile test automation framework that supports native, hybrid, and mobile web apps on iOS and Android.

**How it works:**
1. Appium runs as an **HTTP server** that exposes the W3C WebDriver protocol.
2. Your test code (Java, Python, etc.) sends HTTP requests to the Appium server.
3. Appium translates those commands into platform-specific automation calls:
   - **Android** → UIAutomator2 (for Android ≥ 6.0) or UiAutomator1
   - **iOS** → XCUITest framework (Apple's UI testing framework)
4. The platform framework interacts directly with the device/emulator.

**Key concepts:**
- **DesiredCapabilities** (now W3C options) — specify device, app, platform, version.
- **AppiumDriver** — extends RemoteWebDriver; works with mobile elements.
- **MobileElement** / **WebElement** — used to interact with UI elements.
- **Appium Inspector** — GUI tool for element inspection (like browser DevTools for mobile).

**Unique Appium advantages:**
- No app modification required (no test code embedded in app)
- Same API across iOS and Android
- Supports real devices and emulators/simulators
- Open-source, large community`,
    level: 'basic',
    tags: ['appium', 'mobile-testing', 'architecture', 'introduction'],
  },

  {
    id: 'app-002',
    moduleId: 'appium',
    question: 'What are the different locator strategies specific to Appium for mobile element identification?',
    answer: `In addition to standard Selenium locators (id, xpath, cssSelector), Appium provides **mobile-specific locators:**

**Android-specific:**
- **UiAutomator** — \`driver.findElement(AppiumBy.androidUIAutomator("new UiSelector().text(\"OK\")"))\`
  Powerful — supports scroll, text matching, content description.
- **AccessibilityId** — matches the \`content-desc\` attribute in Android.
  \`driver.findElement(AppiumBy.accessibilityId("OK Button"))\`

**iOS-specific:**
- **IosClassChain** — faster than XPath for iOS, supports predicates.
  \`driver.findElement(AppiumBy.iOSClassChain("**/XCUIElementTypeButton[\`label == 'OK'\`]"))\`
- **IosNsPredicate** — NSPredicate string queries (Swift-style).
  \`driver.findElement(AppiumBy.iOSNsPredicateString("type == 'XCUIElementTypeButton' AND label == 'OK'"))\`

**Cross-platform:**
- **AccessibilityId** — works on both platforms (testID in React Native, contentDescription in Android, accessibilityLabel in iOS).
- **XPath** — works everywhere but slowest; avoid if possible.

**Best practice priority (mobile):**
AccessibilityId > UIAutomator/IosClassChain > XPath`,
    level: 'basic',
    tags: ['appium', 'locators', 'mobile', 'android', 'ios'],
  },

  {
    id: 'app-003',
    moduleId: 'appium',
    question: 'How do you handle gestures in Appium such as swipe, scroll, and pinch?',
    answer: `Mobile gestures require touch-based interactions. Appium 2.x uses the **W3C Actions API** (replaces deprecated TouchAction).

**Scroll using UiScrollable (Android):**
\`\`\`java
driver.findElement(AppiumBy.androidUIAutomator(
    "new UiScrollable(new UiSelector().scrollable(true))" +
    ".scrollIntoView(new UiSelector().text(\"Target Item\"))"
));
\`\`\`

**Swipe using W3C Actions (cross-platform):**
Define finger press at start point, pause, move to end point, release.

**Scroll using mobile: scroll command (iOS):**
\`\`\`java
Map<String, Object> params = new HashMap<>();
params.put("direction", "down");
params.put("element", element.getId());
driver.executeScript("mobile: scroll", params);
\`\`\``,
    level: 'intermediate',
    tags: ['appium', 'gestures', 'swipe', 'scroll', 'W3C-Actions'],
    codeExample: `// Swipe using W3C Actions API
public void swipeUp(AppiumDriver driver) {
    Dimension size = driver.manage().window().getSize();

    int startX = size.width / 2;
    int startY = (int) (size.height * 0.8);  // 80% from top
    int endY   = (int) (size.height * 0.2);  // 20% from top

    PointerInput finger = new PointerInput(PointerInput.Kind.TOUCH, "finger1");
    Sequence swipeUp = new Sequence(finger, 1)
        .addAction(finger.createPointerMove(Duration.ZERO, PointerInput.Origin.viewport(), startX, startY))
        .addAction(finger.createPointerDown(PointerInput.MouseButton.LEFT.asArg()))
        .addAction(finger.createPointerMove(Duration.ofMillis(600), PointerInput.Origin.viewport(), startX, endY))
        .addAction(finger.createPointerUp(PointerInput.MouseButton.LEFT.asArg()));

    driver.perform(Arrays.asList(swipeUp));
}

// Pinch-to-zoom using two fingers
public void pinchZoom(AppiumDriver driver, WebElement element) {
    Rectangle rect = element.getRect();
    int centerX = rect.getX() + rect.getWidth() / 2;
    int centerY = rect.getY() + rect.getHeight() / 2;

    PointerInput finger1 = new PointerInput(PointerInput.Kind.TOUCH, "finger1");
    PointerInput finger2 = new PointerInput(PointerInput.Kind.TOUCH, "finger2");

    Sequence zoom1 = new Sequence(finger1, 0)
        .addAction(finger1.createPointerMove(Duration.ZERO, PointerInput.Origin.viewport(), centerX - 10, centerY))
        .addAction(finger1.createPointerDown(PointerInput.MouseButton.LEFT.asArg()))
        .addAction(finger1.createPointerMove(Duration.ofMillis(500), PointerInput.Origin.viewport(), centerX - 100, centerY))
        .addAction(finger1.createPointerUp(PointerInput.MouseButton.LEFT.asArg()));

    Sequence zoom2 = new Sequence(finger2, 0)
        .addAction(finger2.createPointerMove(Duration.ZERO, PointerInput.Origin.viewport(), centerX + 10, centerY))
        .addAction(finger2.createPointerDown(PointerInput.MouseButton.LEFT.asArg()))
        .addAction(finger2.createPointerMove(Duration.ofMillis(500), PointerInput.Origin.viewport(), centerX + 100, centerY))
        .addAction(finger2.createPointerUp(PointerInput.MouseButton.LEFT.asArg()));

    driver.perform(Arrays.asList(zoom1, zoom2));
}`,
  },

  {
    id: 'app-004',
    moduleId: 'appium',
    question: 'What DesiredCapabilities are required to start an Android test session with Appium?',
    answer: `In Appium 2.x, capabilities use the W3C format with \`appium:prefix\`. Required capabilities depend on whether testing an app or browser.

**Minimum required for Android native app:**
- \`platformName\` — "Android"
- \`appium:deviceName\` — emulator/device name or serial
- \`appium:platformVersion\` — Android OS version (e.g., "13.0")
- \`appium:app\` — absolute path to .apk, or app ID if installed
- OR \`appium:appPackage\` + \`appium:appActivity\` — to launch an installed app

**Additional important capabilities:**
- \`appium:automationName\` — "UiAutomator2" (required for modern Android)
- \`appium:noReset\` — true = don't clear app data between sessions
- \`appium:fullReset\` — true = uninstall and reinstall app
- \`appium:newCommandTimeout\` — seconds before session times out on idle
- \`appium:udid\` — specific device serial (use when multiple devices connected)`,
    level: 'basic',
    tags: ['appium', 'DesiredCapabilities', 'android', 'configuration'],
    codeExample: `// AppiumConfig.java — Android test setup
public class AppiumConfig {

    public static AndroidDriver createAndroidDriver() throws MalformedURLException {
        UiAutomator2Options options = new UiAutomator2Options()
            .setPlatformName("Android")
            .setDeviceName("Pixel_6_API_33")
            .setPlatformVersion("13")
            .setAutomationName("UiAutomator2")
            .setAppPackage("com.example.myapp")
            .setAppActivity(".MainActivity")
            .setNoReset(true)
            .setNewCommandTimeout(Duration.ofSeconds(60))
            .setUdid(System.getenv("ANDROID_UDID")); // from CI env

        return new AndroidDriver(
            new URL("http://127.0.0.1:4723"),
            options
        );
    }
}`,
  },

  {
    id: 'app-005',
    moduleId: 'appium',
    question: 'Scenario: How would you automate a login flow in a mobile app with Appium, handling both Android and iOS?',
    answer: `A cross-platform mobile POM strategy separates the page interface from platform-specific implementations.

**Architecture:**
- \`LoginPage\` interface — defines all actions (enterUsername, enterPassword, tapLogin).
- \`AndroidLoginPage\` — implements using Android-specific locators.
- \`IosLoginPage\` — implements using iOS-specific locators.
- \`MobileFactory\` — instantiates the correct page based on platform.

**Cross-platform locator preference:** Always prefer \`accessibilityId\` when the development team sets \`testID\` (React Native), \`contentDescription\` (Android), or \`accessibilityLabel\` (iOS) — these work on both platforms.

**Handling keyboards:**
After typing in an input, the soft keyboard may block the next element. Use:
\`\`\`java
driver.hideKeyboard();
\`\`\``,
    level: 'scenario',
    tags: ['appium', 'POM', 'cross-platform', 'login', 'scenario'],
    codeExample: `// MobileLoginPage.java
public class MobileLoginPage {
    private final AppiumDriver driver;
    private final WebDriverWait wait;

    // Using AccessibilityId — works on both platforms if testID is set
    private final By usernameField = AppiumBy.accessibilityId("username-input");
    private final By passwordField = AppiumBy.accessibilityId("password-input");
    private final By loginButton   = AppiumBy.accessibilityId("login-button");
    private final By errorText     = AppiumBy.accessibilityId("error-message");

    public MobileLoginPage(AppiumDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(15));
    }

    public MobileLoginPage enterUsername(String username) {
        WebElement field = wait.until(
            ExpectedConditions.elementToBeClickable(usernameField));
        field.clear();
        field.sendKeys(username);
        return this;
    }

    public MobileLoginPage enterPassword(String password) {
        driver.findElement(passwordField).sendKeys(password);
        driver.hideKeyboard(); // dismiss keyboard before tapping button
        return this;
    }

    public MobileHomePage tapLogin() {
        wait.until(ExpectedConditions.elementToBeClickable(loginButton)).click();
        return new MobileHomePage(driver);
    }

    public String getErrorText() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(errorText)).getText();
    }
}

// MobileLoginTest.java
public class MobileLoginTest {
    private AppiumDriver driver;

    @BeforeMethod
    public void setUp() throws MalformedURLException {
        driver = AppiumConfig.createAndroidDriver();
    }

    @Test
    public void testValidLogin() {
        MobileHomePage home = new MobileLoginPage(driver)
            .enterUsername("testuser")
            .enterPassword("TestPass123!")
            .tapLogin();

        Assert.assertTrue(home.isDisplayed(), "Home screen should be visible after login");
    }

    @AfterMethod(alwaysRun = true)
    public void tearDown() {
        if (driver != null) driver.quit();
    }
}`,
  },

  {
    id: 'app-006',
    moduleId: 'appium',
    question: 'MCQ: Which Appium automation backend is used for modern Android testing (Android 6.0+)?',
    answer: `**b) UIAutomator2** is the recommended automation backend for modern Android. Set via \`appium:automationName = "UiAutomator2"\`. It replaced UiAutomator1 and provides better stability, parallel session support, and direct integration with Android's accessibility framework.`,
    level: 'mcq',
    tags: ['appium', 'android', 'UIAutomator2', 'mcq'],
    options: [
      'Selendroid',
      'UIAutomator2',
      'Espresso',
      'Robotium',
    ],
    correctOption: 1,
  },

  {
    id: 'app-007',
    moduleId: 'appium',
    question: 'Rapid Fire: What is the difference between native, hybrid, and mobile web apps in Appium context?',
    answer: `**Native app** — Built with platform-specific SDK (Kotlin/Java for Android, Swift/ObjC for iOS). Full platform capabilities. Appium uses UIAutomator2/XCUITest.

**Hybrid app** — Native wrapper containing a WebView. Appium must switch context: \`NATIVE_APP\` ↔ \`WEBVIEW_xxxx\`. Test web parts like a browser.

**Mobile web** — Regular website accessed via mobile browser (Chrome/Safari). Appium acts as a browser driver. No app installation needed.`,
    level: 'rapid-fire',
    tags: ['appium', 'app-types', 'rapid-fire'],
  },

  {
    id: 'app-008',
    moduleId: 'appium',
    question: 'Rapid Fire: How do you switch context in Appium for a hybrid app?',
    answer: `Use \`driver.getContextHandles()\` to list available contexts (returns Set<String> like \`["NATIVE_APP", "WEBVIEW_com.example.app"]\`). Switch with \`driver.context("WEBVIEW_com.example.app")\` to interact with the web content, and \`driver.context("NATIVE_APP")\` to return to native controls.`,
    level: 'rapid-fire',
    tags: ['appium', 'hybrid', 'context', 'rapid-fire'],
  },
];

// ============================================================
// MODULE 4 — rest-soap-wsdl  (10 questions)
// ============================================================

const soapQuestions: InterviewQuestion[] = [

  {
    id: 'soap-001',
    moduleId: 'rest-soap-wsdl',
    question: 'What is SOAP and how does it differ from REST?',
    answer: `**SOAP (Simple Object Access Protocol)** is a protocol for exchanging structured information in web services, using XML exclusively.

**Key SOAP characteristics:**
- Always uses XML (request and response)
- Operates over any transport (HTTP, SMTP, JMS, TCP)
- Has a strict envelope structure: Envelope → Header + Body
- Defines contracts via **WSDL** (Web Services Description Language)
- Built-in standards: WS-Security, WS-ReliableMessaging, WS-Transaction
- Stateful or stateless

**Key REST characteristics:**
- Architectural style, not a protocol
- Uses any format (JSON, XML, plain text, binary)
- Operates over HTTP only
- Stateless by design
- No strict contract (optional OpenAPI/Swagger)
- Leverages HTTP verbs (GET, POST, PUT, DELETE, PATCH)

| Feature         | SOAP                  | REST                   |
|-----------------|----------------------|------------------------|
| Protocol        | Protocol              | Architectural style    |
| Data format     | XML only              | JSON, XML, etc.        |
| Contract        | WSDL (required)       | OpenAPI (optional)     |
| Transport       | HTTP, SMTP, JMS, etc. | HTTP only              |
| Security        | WS-Security           | HTTPS + OAuth          |
| Performance     | Heavier (XML overhead)| Lighter (JSON)         |
| Use cases       | Enterprise, banking   | Web APIs, microservices|`,
    level: 'basic',
    tags: ['SOAP', 'REST', 'comparison', 'web-services', 'protocol'],
  },

  {
    id: 'soap-002',
    moduleId: 'rest-soap-wsdl',
    question: 'What is WSDL and what are its key components?',
    answer: `**WSDL (Web Services Description Language)** is an XML-based contract that describes a SOAP web service — what operations it offers, what messages it accepts/returns, and how to access it.

**Key WSDL components:**

1. **\`<types>\`** — defines data types (XML Schema / XSD) used in messages.
2. **\`<message>\`** — defines the data elements for each operation (request/response parameters).
3. **\`<portType>\`** (WSDL 1.1) / \`<interface>\`** (WSDL 2.0) — defines the operations (methods) the service exposes and what messages they use.
4. **\`<binding>\`** — specifies the protocol (SOAP/HTTP) and message encoding (literal/encoded).
5. **\`<service>\`** — specifies the endpoint URL where the service is accessible.
6. **\`<port>\`** — associates a binding with a specific network endpoint.

**How it's used:**
- WSDL is read by tools like Apache CXF, JAXWS, SoapUI to auto-generate client stubs.
- SDETs import WSDL into SoapUI to automatically generate test requests.
- \`wsimport\` (JDK tool) generates Java client classes from WSDL:
  \`wsimport -keep -s src -p com.example.client http://service/endpoint?wsdl\``,
    level: 'basic',
    tags: ['WSDL', 'SOAP', 'web-services', 'contract'],
  },

  {
    id: 'soap-003',
    moduleId: 'rest-soap-wsdl',
    question: 'What is the structure of a SOAP message envelope?',
    answer: `A SOAP message is an XML document with a specific envelope structure:

\`\`\`xml
<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope
    xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
    xmlns:ser="http://www.example.com/service">

  <!-- SOAP Header (optional) — metadata, auth tokens, transaction IDs -->
  <soapenv:Header>
    <wsse:Security>
      <wsse:UsernameToken>
        <wsse:Username>admin</wsse:Username>
        <wsse:Password>secret</wsse:Password>
      </wsse:UsernameToken>
    </wsse:Security>
  </soapenv:Header>

  <!-- SOAP Body (required) — the actual request/response data -->
  <soapenv:Body>
    <ser:GetUserRequest>
      <ser:UserId>12345</ser:UserId>
    </ser:GetUserRequest>
  </soapenv:Body>

</soapenv:Envelope>
\`\`\`

**SOAP Fault** (error response in Body):
\`\`\`xml
<soapenv:Body>
  <soapenv:Fault>
    <faultcode>soapenv:Client</faultcode>
    <faultstring>Invalid UserId</faultstring>
    <detail><error>UserId must be a positive integer</error></detail>
  </soapenv:Fault>
</soapenv:Body>
\`\`\``,
    level: 'intermediate',
    tags: ['SOAP', 'envelope', 'structure', 'XML'],
  },

  {
    id: 'soap-004',
    moduleId: 'rest-soap-wsdl',
    question: 'How do you test a SOAP web service using REST Assured or raw HTTP?',
    answer: `SOAP services accept HTTP POST requests with a specific Content-Type and XML body. You can test them with REST Assured by sending raw XML.

**Key points:**
- Content-Type must be \`text/xml\` (SOAP 1.1) or \`application/soap+xml\` (SOAP 1.2)
- SOAPAction header is required in SOAP 1.1
- Response is always XML — parse with XmlPath
- Validate the XPath structure of the response`,
    level: 'intermediate',
    tags: ['SOAP', 'REST-Assured', 'XML', 'testing'],
    codeExample: `// SOAP Web Service Test using REST Assured
public class SoapWebServiceTest {

    private static final String SOAP_ENDPOINT = "http://www.dneonline.com/calculator.asmx";

    @Test(description = "Test SOAP Add operation")
    public void testSoapAddOperation() {
        String soapBody = """
            <?xml version="1.0" encoding="utf-8"?>
            <soap:Envelope
                xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
                xmlns:calc="http://tempuri.org/">
              <soap:Header/>
              <soap:Body>
                <calc:Add>
                  <calc:intA>10</calc:intA>
                  <calc:intB>25</calc:intB>
                </calc:Add>
              </soap:Body>
            </soap:Envelope>
            """;

        given()
            .contentType("text/xml; charset=utf-8")
            .header("SOAPAction", "http://tempuri.org/Add")
            .body(soapBody)
        .when()
            .post(SOAP_ENDPOINT)
        .then()
            .statusCode(200)
            .contentType(containsString("text/xml"))
            // XPath validation on XML response
            .body(hasXPath("//AddResult[text()='35']"));
    }

    @Test(description = "Test SOAP error handling — invalid input")
    public void testSoapFaultResponse() {
        String invalidSoapBody = """
            <?xml version="1.0" encoding="utf-8"?>
            <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
              <soap:Body>
                <InvalidOperation xmlns="http://tempuri.org/"/>
              </soap:Body>
            </soap:Envelope>
            """;

        String responseBody =
        given()
            .contentType("text/xml; charset=utf-8")
            .header("SOAPAction", "")
            .body(invalidSoapBody)
        .when()
            .post(SOAP_ENDPOINT)
        .then()
            // SOAP faults may still return 200 or 500
            .extract().body().asString();

        // Parse SOAP Fault
        XmlPath xmlPath = new XmlPath(responseBody);
        // Verify it's a valid SOAP envelope
        Assert.assertNotNull(responseBody);
    }
}`,
  },

  {
    id: 'soap-005',
    moduleId: 'rest-soap-wsdl',
    question: 'What is the difference between SOAP 1.1 and SOAP 1.2?',
    answer: `| Feature              | SOAP 1.1                        | SOAP 1.2                          |
|----------------------|---------------------------------|-----------------------------------|
| Namespace            | schemas.xmlsoap.org/soap/envelope/ | www.w3.org/2003/05/soap-envelope |
| Content-Type         | text/xml                        | application/soap+xml              |
| SOAPAction header    | Required (can be empty string)  | Included in Content-Type          |
| Error element        | \`<Fault>\` with faultcode/string | \`<Fault>\` with Code/Reason/Role  |
| Fault codes          | VersionMismatch, MustUnderstand, Client, Server | DataEncodingUnknown, Sender, Receiver |
| HTTP binding         | Loosely defined                 | Formally standardized             |
| Standardization      | W3C Note (not full standard)    | W3C Recommendation (full standard)|

**Practical impact for SDET:**
- Always check WSDL to determine which SOAP version the service uses.
- Wrong Content-Type will result in 415 Unsupported Media Type or a SOAP Fault.
- SOAPAction header is mandatory for SOAP 1.1 services.`,
    level: 'intermediate',
    tags: ['SOAP', 'SOAP-1.1', 'SOAP-1.2', 'comparison'],
  },

  {
    id: 'soap-006',
    moduleId: 'rest-soap-wsdl',
    question: 'What are the key REST API best practices that an SDET should verify during API testing?',
    answer: `An SDET testing REST APIs should verify these best practices are followed:

**1. HTTP Method Semantics:**
- GET = read-only, no side effects
- POST = create; returns 201 + Location header
- PUT = full replacement
- PATCH = partial update
- DELETE = remove; returns 204 or 200

**2. Status Code Correctness:**
Verify the API returns appropriate codes — not just 200 for everything.

**3. Response Structure:**
- Consistent JSON structure across endpoints
- Error responses follow a standard format: \`{"error": "...", "code": "...", "message": "..."}\`

**4. Versioning:**
- URL versioning (\`/api/v1/\`) or header-based versioning.

**5. Pagination:**
- Large collections should be paginated with \`page\`, \`pageSize\`, total count in metadata.

**6. Authentication & Authorization:**
- 401 for missing/invalid credentials
- 403 for insufficient permissions (authenticated but not authorized)

**7. Rate Limiting:**
- 429 Too Many Requests with \`Retry-After\` header.

**8. Input Validation:**
- 400/422 for invalid inputs with descriptive error messages.

**9. HTTPS:**
- All endpoints over TLS.

**10. Idempotency:**
- PUT, DELETE operations should be idempotent.`,
    level: 'advanced',
    tags: ['REST', 'best-practices', 'API-testing', 'SDET'],
  },

  {
    id: 'soap-007',
    moduleId: 'rest-soap-wsdl',
    question: 'MCQ: Which HTTP method should be used to retrieve a resource without modifying it?',
    answer: `**a) GET**. GET is the idempotent, read-only method. It should have no side effects on the server. If a GET request changes server state (e.g., increments a view counter in a way that's observable), that's technically a violation of REST principles.`,
    level: 'mcq',
    tags: ['REST', 'HTTP-methods', 'GET', 'mcq'],
    options: ['GET', 'POST', 'PUT', 'FETCH'],
    correctOption: 0,
  },

  {
    id: 'soap-008',
    moduleId: 'rest-soap-wsdl',
    question: 'MCQ: What does WSDL stand for and what is its primary purpose?',
    answer: `**b) Web Services Description Language** — WSDL is the XML-based contract/specification document that describes a SOAP web service's operations, input/output messages, data types, and endpoint URL. It enables auto-generation of client code and documentation.`,
    level: 'mcq',
    tags: ['WSDL', 'SOAP', 'mcq'],
    options: [
      'Web Service Data Layer',
      'Web Services Description Language',
      'Web Standard Definition Language',
      'Workflow Service Design Logic',
    ],
    correctOption: 1,
  },

  {
    id: 'soap-009',
    moduleId: 'rest-soap-wsdl',
    question: 'Rapid Fire: What is REST? What does it stand for?',
    answer: `**REST** stands for **Representational State Transfer**. It is an architectural style for distributed hypermedia systems, defined by Roy Fielding in his 2000 dissertation. Key constraints: statelessness, client-server, cacheability, uniform interface (resource-based URIs, standard HTTP methods), layered system.`,
    level: 'rapid-fire',
    tags: ['REST', 'definition', 'rapid-fire'],
  },

  {
    id: 'soap-010',
    moduleId: 'rest-soap-wsdl',
    question: 'Rapid Fire: What is the difference between authentication and authorization?',
    answer: `**Authentication** — "Who are you?" Verifying identity (login, token validation). Returns 401 if authentication fails.

**Authorization** — "What are you allowed to do?" Checking permissions after identity is confirmed. Returns 403 if the authenticated user lacks permission for the requested action.`,
    level: 'rapid-fire',
    tags: ['security', 'authentication', 'authorization', 'rapid-fire'],
  },
];

// ============================================================
// MODULE 5 — performance-testing  (10 questions)
// ============================================================

const performanceQuestions: InterviewQuestion[] = [

  {
    id: 'perf-001',
    moduleId: 'performance-testing',
    question: 'What is performance testing, and what are its different types?',
    answer: `**Performance testing** is a non-functional testing type that evaluates how a system behaves under various load conditions — assessing speed, stability, scalability, and resource usage.

**Types of performance testing:**

1. **Load Testing** — tests system behavior under expected normal load. Answers: "Can the system handle our typical traffic?"

2. **Stress Testing** — pushes the system beyond its limits to find the breaking point. Answers: "How does the system fail, and what's the maximum capacity?"

3. **Spike Testing** — sudden, sharp increase in load (e.g., flash sale). Answers: "Can the system recover from sudden traffic spikes?"

4. **Soak/Endurance Testing** — sustained load over a long period (hours to days). Answers: "Are there memory leaks or performance degradation over time?"

5. **Volume Testing** — large amounts of data in the database. Answers: "Does performance degrade with data growth?"

6. **Scalability Testing** — tests the system's ability to scale up/down. Answers: "Can we add servers to handle more load?"

7. **Baseline Testing** — establishes a performance benchmark for comparison.

**Key performance metrics:**
- **Response Time (RT)** — time for server to process a request.
- **Throughput** — requests processed per second (RPS/TPS).
- **Error Rate** — percentage of failed requests.
- **Concurrency** — number of simultaneous users.
- **Latency** — network delay.
- **CPU/Memory utilization** — server resource consumption.`,
    level: 'basic',
    tags: ['performance-testing', 'types', 'load-testing', 'stress-testing'],
  },

  {
    id: 'perf-002',
    moduleId: 'performance-testing',
    question: 'What is JMeter and how do you create a basic load test plan?',
    answer: `**Apache JMeter** is an open-source Java-based performance testing tool. It simulates multiple users making requests and measures performance metrics.

**JMeter test plan hierarchy:**
- **Test Plan** — root element; global configuration.
- **Thread Group** — defines virtual users (threads), ramp-up time, loop count.
- **Samplers** — define what requests to make (HTTP Request, JDBC, FTP, etc.).
- **Config Elements** — HTTP Header Manager, HTTP Cookie Manager, CSV Data Set Config.
- **Listeners** — View Results Tree, Summary Report, Aggregate Report, Response Time Graph.
- **Assertions** — Response Assertion, Duration Assertion, Size Assertion.
- **Timers** — Constant Timer, Gaussian Timer (think time simulation).
- **Pre/Post Processors** — extract data, manipulate variables.

**Thread Group settings:**
- **Number of Threads (users)** — concurrent virtual users.
- **Ramp-Up Period** — time to reach full thread count (e.g., 100 users in 60 seconds = ~1.67 users/sec).
- **Loop Count** — number of iterations per thread.
- **Duration** — run for N seconds instead of fixed loops.

**Running JMeter from CLI (for CI/CD):**
\`\`\`bash
jmeter -n -t test-plan.jmx -l results.jtl -e -o reports/
\`\`\`
- \`-n\` — non-GUI mode
- \`-t\` — test plan file
- \`-l\` — output log file
- \`-e -o\` — generate HTML dashboard report`,
    level: 'basic',
    tags: ['JMeter', 'performance-testing', 'load-test', 'thread-group'],
  },

  {
    id: 'perf-003',
    moduleId: 'performance-testing',
    question: 'What are performance testing SLAs (Service Level Agreements) and how do you define them?',
    answer: `**Performance SLAs** are contractual commitments defining acceptable performance thresholds. In testing, they serve as pass/fail criteria.

**Common SLA metrics:**

| Metric              | Typical Target                        |
|---------------------|---------------------------------------|
| Average Response Time| < 200ms (API), < 3s (web page load)  |
| 95th Percentile RT  | < 500ms (API)                         |
| 99th Percentile RT  | < 1000ms                              |
| Error Rate          | < 1% (ideally 0%)                     |
| Throughput          | > 500 TPS for the given user load     |
| CPU Utilization     | < 70% under normal load               |
| Memory Usage        | No unbounded growth (stable over time)|

**Percentiles explained:**
- **P50 (median)** — 50% of requests are faster than this.
- **P90** — 90% of requests are faster; 10% are slower.
- **P95** — 95% are faster; outliers but important.
- **P99** — 99% are faster; extreme outlier check.
- Always focus on P95/P99, NOT average — averages hide outlier latency.

**JMeter SLA enforcement:**
In JMeter, use **Duration Assertion** (response time limit) or **Percent Error Assertion**.
For CI/CD, use Taurus or JMeter-plugin-manager to fail the build when SLAs are breached.`,
    level: 'intermediate',
    tags: ['performance-testing', 'SLA', 'percentiles', 'metrics'],
  },

  {
    id: 'perf-004',
    moduleId: 'performance-testing',
    question: 'How do you parameterize JMeter tests with CSV data for realistic load simulation?',
    answer: `JMeter's **CSV Data Set Config** element allows reading test data from a CSV file and assigning values to JMeter variables. This enables each virtual user to send different data (avoiding cache effects and testing data diversity).

**CSV Data Set Config settings:**
- **Filename** — path to CSV file (absolute or relative to JMeter script)
- **Variable Names** — comma-separated variable names mapping to CSV columns
- **Delimiter** — comma by default
- **Allow Quoted Data** — handles fields with commas inside quotes
- **Recycle on EOF** — loop back to start when CSV is exhausted
- **Stop Thread on EOF** — stop the thread when data runs out
- **Sharing Mode** — All Threads (global), Current Thread Group, Current Thread`,
    level: 'intermediate',
    tags: ['JMeter', 'CSV', 'parameterization', 'performance-testing'],
    codeExample: `// testdata/users.csv:
// username,password,expectedRole
// user001,Pass123!,customer
// user002,Pass456!,admin
// user003,Pass789!,moderator

// JMeter Thread Group setup:
// 1. Add CSV Data Set Config:
//    - Filename: testdata/users.csv
//    - Variable Names: username,password,expectedRole
//    - Sharing Mode: All Threads
//    - Recycle on EOF: True

// 2. In HTTP Request Sampler body:
// {
//   "username": "[username]",
//   "password": "[password]"
// }

// 3. Add Response Assertion:
//    - Response Field: Response Body
//    - Pattern to Test: [expectedRole]

// JMeter BeanShell / JSR223 Post Processor (Groovy) to extract token:
// vars.put("authToken", com.jayway.jsonpath.JsonPath.read(prev.getResponseDataAsString(), "$.token"));

// 4. Use token in next request header:
//    Authorization: Bearer [authToken]

// Running with CLI and custom SLA check:
// jmeter -n -t login-test.jmx
//   -Jusers=100 -Jrampup=30 -Jduration=300
//   -l results.jtl -e -o report/

// Taurus (config.yml) for SLA enforcement:
/*
execution:
- concurrency: 100
  ramp-up: 30s
  hold-for: 5m
  scenario: login

scenarios:
  login:
    script: login-test.jmx

reporting:
- module: passfail
  criteria:
  - avg-rt of LoginRequest > 500ms for 10s, fail
  - fail of LoginRequest > 1%, fail
*/`,
  },

  {
    id: 'perf-005',
    moduleId: 'performance-testing',
    question: 'How do you integrate JMeter performance tests into a CI/CD pipeline?',
    answer: `Integrating performance tests into CI/CD ensures performance regressions are caught before deployment.

**Jenkins integration:**
1. **Performance Plugin** — parses JMeter JTL files and shows trends on Jenkins dashboard.
2. **Configure build failure thresholds** based on error rate, response time.
3. Run JMeter in CLI mode (no GUI) with:
   \`\`\`bash
   jmeter -n -t tests/load-test.jmx -Jusers=[USERS] -Jduration=[DURATION] -l results.jtl
   \`\`\`

**GitHub Actions example:**
\`\`\`yaml
- name: Run JMeter Load Test
  run: |
    jmeter -n -t tests/api-load-test.jmx \\
      -Jusers=50 -Jrampup=10 -Jduration=60 \\
      -l results.jtl -e -o jmeter-report/

- name: Upload JMeter Report
  uses: actions/upload-artifact@v3
  with:
    name: jmeter-report
    path: jmeter-report/
\`\`\`

**Gate criteria (fail the build if):**
- Average response time > SLA threshold
- Error rate > 1%
- P95 response time > 1000ms

Use **Taurus** (BlazeMeter's open-source wrapper) for declarative SLA enforcement:
\`\`\`bash
bzt load-test-config.yml -o settings.env.BASE_URL=$BASE_URL
\`\`\``,
    level: 'advanced',
    tags: ['JMeter', 'CI-CD', 'Jenkins', 'GitHub-Actions', 'performance-testing'],
  },

  {
    id: 'perf-006',
    moduleId: 'performance-testing',
    question: 'Scenario: Your API was passing performance tests at 100 users but fails at 200 users. How do you investigate?',
    answer: `This is a scalability issue — the system has a bottleneck that becomes visible under higher load. Systematic investigation:

**Step 1 — Identify what degrades:**
- Look at JMeter Aggregate Report: which specific endpoints show high P95/P99?
- Check error types: timeouts (503), out-of-memory (500), connection refused?

**Step 2 — Check application metrics:**
- CPU, memory, thread count via APM (New Relic, Datadog, Prometheus/Grafana).
- Is CPU peaking at 100%? → Compute bottleneck.
- Is memory growing unboundedly? → Memory leak.
- Is thread pool exhausted? → Connection pool bottleneck.

**Step 3 — Database layer:**
- Slow queries? → Enable query logging, check EXPLAIN ANALYZE.
- Connection pool maxed out? → Increase pool size or add read replicas.
- Missing indexes on high-traffic queries?

**Step 4 — Network/External dependencies:**
- Are external API calls slow under load?
- Is the load balancer properly distributing?

**Step 5 — Application code:**
- N+1 query problem (fetching related data in a loop)?
- Synchronization bottlenecks (locks, synchronized blocks)?
- Inefficient caching (cache misses under high load)?

**Resolution approaches:**
- Add caching (Redis) for frequently read data
- Optimize slow DB queries
- Increase thread pool/connection pool sizes
- Horizontal scaling (add server instances)
- Async processing for heavy operations`,
    level: 'scenario',
    tags: ['performance-testing', 'bottleneck', 'investigation', 'scenario'],
  },

  {
    id: 'perf-007',
    moduleId: 'performance-testing',
    question: 'Scenario: How do you perform a realistic load test that simulates actual user behavior?',
    answer: `Realistic load tests model actual user journeys, not just hammering a single endpoint.

**1. Define user scenarios from analytics:**
- Identify top user flows: login → browse → search → add-to-cart → checkout.
- Use actual traffic ratios: 60% browse-only, 30% search, 10% purchase.

**2. Think time:**
- Add random pause between actions (Gaussian timer: 2±0.5 seconds).
- Prevents unrealistically fast request fire.

**3. Parameterize with realistic data:**
- Different usernames, search terms, product IDs from production data samples.

**4. Model using JMeter Thread Groups with ratios:**
- Thread Group 1 (60 threads): Browse flow
- Thread Group 2 (30 threads): Search flow
- Thread Group 3 (10 threads): Checkout flow

**5. Warm-up phase:**
- Start with low concurrency and ramp up (prevents cold-start skewing results).

**6. Steady state:**
- Run at target load for ≥ 5 minutes to see stable behavior.

**7. Cool-down:**
- Gradually reduce load.

**8. Baseline comparison:**
- Compare this run against the established baseline.
- Flag any metric that degrades by > 10% from baseline.`,
    level: 'scenario',
    tags: ['JMeter', 'realistic-load', 'user-journey', 'scenario'],
  },

  {
    id: 'perf-008',
    moduleId: 'performance-testing',
    question: 'MCQ: Which JMeter element is used to extract dynamic values (like auth tokens) from responses for use in subsequent requests?',
    answer: `**b) JSON Extractor (Post Processor)**. The JSON Extractor uses JSONPath expressions to extract values from JSON responses and store them in JMeter variables. For XML responses, use XPath Extractor. For regex, use Regular Expression Extractor.`,
    level: 'mcq',
    tags: ['JMeter', 'JSON-Extractor', 'correlation', 'mcq'],
    options: [
      'HTTP Cookie Manager',
      'JSON Extractor (Post Processor)',
      'Response Assertion',
      'CSV Data Set Config',
    ],
    correctOption: 1,
  },

  {
    id: 'perf-009',
    moduleId: 'performance-testing',
    question: 'Rapid Fire: What is the difference between load testing and stress testing?',
    answer: `**Load testing** tests system behavior at expected/normal concurrent user levels to verify it meets performance SLAs. **Stress testing** goes BEYOND normal capacity to find the breaking point — where and how the system fails, and whether it recovers gracefully after the stress is removed.`,
    level: 'rapid-fire',
    tags: ['performance-testing', 'load-testing', 'stress-testing', 'rapid-fire'],
  },

  {
    id: 'perf-010',
    moduleId: 'performance-testing',
    question: 'Rapid Fire: What is throughput in performance testing?',
    answer: `**Throughput** is the number of requests or transactions a system can process per unit of time — typically measured as **Requests Per Second (RPS)** or **Transactions Per Second (TPS)**. Higher throughput under load indicates better performance capacity.`,
    level: 'rapid-fire',
    tags: ['performance-testing', 'throughput', 'metrics', 'rapid-fire'],
  },
];

// ============================================================
// MODULE 6 — general-sdet  (7 questions)
// ============================================================

const generalSdetQuestions: InterviewQuestion[] = [

  {
    id: 'sdet-001',
    moduleId: 'general-sdet',
    question: 'What is the SDET role and how does it differ from a QA Engineer?',
    answer: `**SDET (Software Development Engineer in Test)** is a hybrid role combining software development and quality assurance skills. SDETs build the automation infrastructure and frameworks that enable scalable testing.

**SDET responsibilities:**
- Design and implement test automation frameworks from scratch
- Write production-quality test code (Java, Python, TypeScript)
- Build and maintain CI/CD test pipelines
- Create test utilities, helpers, and reporting tools
- Perform code reviews for test code
- API testing, performance testing, mobile testing
- Contribute to overall engineering decisions

**Traditional QA Engineer responsibilities:**
- Write and execute manual test cases
- Use existing automation tools (may record-and-playback)
- Focus on exploratory and regression testing
- Raise defect reports

**Key differences:**

| Aspect               | SDET                          | QA Engineer                |
|----------------------|-------------------------------|----------------------------|
| Coding depth         | Strong (full dev-level)       | Basic to intermediate      |
| Framework ownership  | Builds frameworks             | Uses existing frameworks   |
| CI/CD involvement    | Designs pipelines             | Runs pipelines             |
| Scope                | Full SDLC involvement         | Testing phase focus        |
| Output               | Test infrastructure + tests   | Test cases + bug reports   |

An SDET is expected to be a **developer who specializes in quality** — not just a tester who writes scripts.`,
    level: 'basic',
    tags: ['SDET', 'role', 'QA', 'career'],
  },

  {
    id: 'sdet-002',
    moduleId: 'general-sdet',
    question: 'What is the Test Pyramid and why is it important for test strategy?',
    answer: `The **Test Pyramid** (introduced by Mike Cohn) is a model for balanced test distribution across different test levels, optimizing for speed, cost, and coverage.

**Three layers (bottom to top):**

**1. Unit Tests (base — most tests):**
- Test individual functions/classes in isolation.
- Fast (milliseconds), cheap, pinpoint failures precisely.
- Should make up ~70% of all tests.
- Tools: JUnit 5, Mockito, AssertJ.

**2. Integration/API Tests (middle):**
- Test interactions between components (service + DB, API endpoints).
- Medium speed (seconds), moderate cost.
- Should make up ~20% of all tests.
- Tools: REST Assured, Testcontainers, Spring Boot Test.

**3. End-to-End / UI Tests (top — fewest tests):**
- Test full user journeys through the browser/app.
- Slow (minutes), expensive to maintain, brittle.
- Should make up ~10% of all tests.
- Tools: Selenium, Playwright, Cypress.

**Why it matters:**
- Inverted pyramid (too many E2E) → slow CI, flaky tests, expensive maintenance.
- Correct pyramid → fast feedback loops, stable CI, lower cost.
- Each layer catches different defect categories — all three are needed.

**Test Trophy** (Kent C. Dodds) — a variant that emphasizes integration tests more than unit tests, arguing unit tests with mocks don't catch enough real-world bugs.`,
    level: 'basic',
    tags: ['test-pyramid', 'test-strategy', 'unit-test', 'e2e', 'SDET'],
  },

  {
    id: 'sdet-003',
    moduleId: 'general-sdet',
    question: 'What is CI/CD and how do automated tests fit into the pipeline?',
    answer: `**CI (Continuous Integration)** — developers frequently merge code into a shared branch. Every merge triggers an automated build and test run to detect integration issues early.

**CD (Continuous Delivery/Deployment)** — extends CI by automatically deploying verified code to staging/production environments.

**Where automated tests fit in the CI/CD pipeline:**

\`\`\`
Code Push → Build → Unit Tests → Static Analysis (SonarQube)
         → Integration Tests → API Tests → Deploy to Staging
         → Smoke Tests → Regression Suite → Performance Tests
         → Deploy to Production → Synthetic Monitoring
\`\`\`

**Test execution strategy in CI:**
1. **PR Gates (fast feedback):** Unit + API tests only — must complete in < 10 minutes.
2. **Merge to main:** Full regression suite — can take up to 30 minutes.
3. **Nightly build:** Full regression + performance tests + data-driven tests.
4. **Release gate:** Complete E2E + smoke + performance must pass before production deploy.

**Parallel test execution in CI:**
- Use \`-Dparallel=methods\` in TestNG or \`-T 4\` in Maven Surefire.
- Split tests into chunks across multiple CI agents.

**Popular CI tools:** Jenkins, GitHub Actions, GitLab CI, Azure DevOps, CircleCI.`,
    level: 'intermediate',
    tags: ['CI-CD', 'pipeline', 'automation', 'Jenkins', 'SDET'],
  },

  {
    id: 'sdet-004',
    moduleId: 'general-sdet',
    question: 'Scenario: A flaky test is failing intermittently in CI but passes locally. How do you investigate and fix it?',
    answer: `**Flaky tests** are among the most time-consuming problems in automation. A systematic approach is essential.

**Step 1 — Gather data:**
- How often does it fail? (1 in 5 runs? 1 in 50?)
- Which step fails (assertion, element find, API call)?
- Is it always the same failure point or random?
- Does it fail only in CI or also on other machines?

**Step 2 — Common root causes and fixes:**

**Timing/synchronization issues (most common in Selenium):**
- Add explicit waits for element visibility/clickability.
- Remove Thread.sleep() calls.
- Increase WebDriverWait timeout.

**Test data contamination:**
- Test depends on data left by a previous test.
- Fix: Make each test self-sufficient — create and teardown its own data.

**Environment differences (local vs CI):**
- Different browser versions, screen resolution, system resources.
- Fix: Use Docker for consistent environments; headless Chrome in CI.

**Race conditions in async operations:**
- Fix: Wait for specific completion signals (element appears, API returns success).

**Test order dependency:**
- Tests must not depend on execution order.
- Fix: Make tests independent; use @BeforeMethod for fresh setup.

**External service instability:**
- If testing against a real third-party service that's unreliable.
- Fix: Mock the external service in integration tests; test real service separately.

**Step 3 — Quarantine and track:**
- Tag the flaky test with \`@Test(enabled = false)\` or in a "flaky" group.
- Create a bug ticket with reproduction steps.
- Set a SLA to fix: no flaky test should remain >2 sprints.`,
    level: 'scenario',
    tags: ['flaky-tests', 'CI-CD', 'debugging', 'scenario', 'SDET'],
  },

  {
    id: 'sdet-005',
    moduleId: 'general-sdet',
    question: 'Behavioral: Describe a time you improved an existing test automation framework. What was the problem and what did you do?',
    answer: `This is a behavioral question — use the **STAR method** (Situation, Task, Action, Result):

**Sample strong answer:**

**Situation:** Our Selenium framework had a 40% flaky test rate in CI, taking 90 minutes to run 300 tests. Developers were ignoring failures because they couldn't trust results.

**Task:** I was assigned to stabilize the framework and reduce execution time to under 30 minutes.

**Action:**
1. **Audited all failures** — categorized into: timing issues (60%), data contamination (25%), environment issues (15%).
2. **Replaced implicit waits** with explicit waits and proper ExpectedConditions everywhere.
3. **Introduced test data isolation** — each test creates its own data via API in @BeforeMethod and deletes it in @AfterMethod.
4. **Added retry logic** for known intermittent network issues in CI.
5. **Enabled parallel execution** (4 threads) using ThreadLocal<WebDriver>.
6. **Migrated to headless Chrome** in CI to reduce resource overhead.
7. **Introduced Allure reporting** with screenshots on failure.

**Result:**
- Flaky rate dropped from 40% to <2% in 3 weeks.
- Execution time reduced from 90 minutes to 22 minutes (parallel + headless).
- Developer confidence in test results improved — failures were now actionable.
- The approach was documented and presented to other teams.

**Tips for your own answer:** Quantify the improvement, explain your thought process, mention collaboration with developers/DevOps.`,
    level: 'behavioral',
    tags: ['behavioral', 'STAR', 'framework-improvement', 'SDET'],
  },

  {
    id: 'sdet-006',
    moduleId: 'general-sdet',
    question: 'MCQ: Which of the following best describes a "smoke test"?',
    answer: `**a) A quick, high-level test to verify that the most critical functionality works after a new build**. Smoke tests are the first gate — if they fail, there's no point running the full regression suite. They're fast (usually < 10 minutes) and cover happy paths of core features.`,
    level: 'mcq',
    tags: ['smoke-test', 'testing-types', 'mcq', 'SDET'],
    options: [
      'A quick test to verify critical functionality works after a new build',
      'A test that checks all edge cases of a feature',
      'A performance test that simulates maximum load',
      'A test that runs once a week to check security',
    ],
    correctOption: 0,
  },

  {
    id: 'sdet-007',
    moduleId: 'general-sdet',
    question: 'Rapid Fire: What is the difference between regression testing and smoke testing?',
    answer: `**Smoke testing** — quick, broad check that the core system is UP and working after a build/deployment (~10-20 critical test cases). Run before anything else.

**Regression testing** — comprehensive test suite verifying that new changes haven't broken existing functionality. Broader, slower, run after smoke passes and before release.`,
    level: 'rapid-fire',
    tags: ['smoke-testing', 'regression-testing', 'rapid-fire', 'SDET'],
  },
];

// ============================================================
// EXPORT — all questions combined
// ============================================================

export const interviewQuestions: InterviewQuestion[] = [
  ...seleniumQuestions,
  ...restAssuredQuestions,
  ...appiumQuestions,
  ...soapQuestions,
  ...performanceQuestions,
  ...generalSdetQuestions,
];

// ── Utility: get questions by module ──────────────────────────
export function getQuestionsByModule(moduleId: string): InterviewQuestion[] {
  return interviewQuestions.filter(q => q.moduleId === moduleId);
}

// ── Utility: get questions by level ──────────────────────────
export function getQuestionsByLevel(level: QuestionLevel): InterviewQuestion[] {
  return interviewQuestions.filter(q => q.level === level);
}

// ── Utility: get questions by tag ────────────────────────────
export function getQuestionsByTag(tag: string): InterviewQuestion[] {
  return interviewQuestions.filter(q =>
    q.tags.some(t => t.toLowerCase() === tag.toLowerCase())
  );
}

// ── Summary ──────────────────────────────────────────────────
export const questionSummary = {
  total: interviewQuestions.length,
  byModule: {
    'selenium-webdriver':   seleniumQuestions.length,
    'rest-assured':         restAssuredQuestions.length,
    'appium':               appiumQuestions.length,
    'rest-soap-wsdl':       soapQuestions.length,
    'performance-testing':  performanceQuestions.length,
    'general-sdet':         generalSdetQuestions.length,
  },
  byLevel: {
    basic:            interviewQuestions.filter(q => q.level === 'basic').length,
    intermediate:     interviewQuestions.filter(q => q.level === 'intermediate').length,
    advanced:         interviewQuestions.filter(q => q.level === 'advanced').length,
    scenario:         interviewQuestions.filter(q => q.level === 'scenario').length,
    coding:           interviewQuestions.filter(q => q.level === 'coding').length,
    mcq:              interviewQuestions.filter(q => q.level === 'mcq').length,
    'rapid-fire':     interviewQuestions.filter(q => q.level === 'rapid-fire').length,
    behavioral:       interviewQuestions.filter(q => q.level === 'behavioral').length,
    'company-specific': interviewQuestions.filter(q => q.level === 'company-specific').length,
  },
} as const;
