export interface TopicContent {
  id: string;
  moduleId: string;
  title: string;
  priority: 'hot' | 'warm' | 'normal';
  estimatedMinutes: number;
  overview: string;
  whyItMatters: string;
  explanation: string;
  keyPoints: string[];
  codeExample?: string;
  codeLanguage?: string;
  realWorldExample: string;
  commonMistakes: string[];
  bestPractices: string[];
  interviewQuestions: { q: string; a: string }[];
  revisionSummary: string;
  tags: string[];
}

export const topicContents: TopicContent[] = [
  // ─── MODULE 1: SELENIUM WEBDRIVER ───────────────────────────────────────────
  {
    id: 'webdriver-architecture',
    moduleId: 'selenium-webdriver',
    title: 'WebDriver Architecture',
    priority: 'hot',
    estimatedMinutes: 60,
    overview: 'Selenium WebDriver is a browser automation framework that uses a client-server protocol (W3C WebDriver) to control browsers natively.',
    whyItMatters: 'Understanding the architecture helps you debug flaky tests, optimize performance, and understand why certain commands behave the way they do across browsers.',
    explanation: `Selenium WebDriver architecture consists of three main layers:

**1. Client Libraries (Language Bindings)**
These are the APIs in Java, Python, C#, Ruby, etc. that your test code uses. When you call driver.findElement(), you are calling a Java binding that translates to HTTP requests.

**2. JSON Wire Protocol / W3C WebDriver Protocol**
WebDriver uses HTTP REST API under the hood. Commands are serialized as JSON and sent over HTTP to the browser driver. Since Selenium 4, the W3C WebDriver standard is the only protocol used (Selenium 3 supported both).

**3. Browser Drivers**
Each browser has its own WebDriver implementation:
- ChromeDriver — for Chrome/Chromium
- GeckoDriver — for Firefox
- SafariDriver — built into Safari
- EdgeDriver — for Microsoft Edge

The browser driver receives HTTP requests, interprets them, and issues native browser commands through the browser's internal API.

**Request Flow:**
Test Code → Language Binding → HTTP Request → Browser Driver → Browser → Response → HTTP Response → Language Binding → Test Code

**Selenium Grid adds a fourth layer:** A Hub distributes test requests to registered Node machines, enabling parallel execution on multiple browsers/OS combinations.`,
    keyPoints: [
      'WebDriver uses W3C WebDriver Protocol (HTTP REST) since Selenium 4',
      'Each browser has its own driver: ChromeDriver, GeckoDriver, EdgeDriver, SafariDriver',
      'Communication is JSON over HTTP between your code and the browser driver',
      'Selenium 4 removed the Selenium RC / JSON Wire Protocol legacy support',
      'Selenium Grid enables distributed test execution across multiple machines',
      'The browser driver must match the installed browser version',
    ],
    codeExample: `import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;

public class WebDriverDemo {
    public static void main(String[] args) {
        // Selenium 4 auto-manages ChromeDriver via Selenium Manager
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--headless=new"); // Run headless
        options.addArguments("--no-sandbox");
        
        WebDriver driver = new ChromeDriver(options);
        
        try {
            driver.get("https://www.example.com");
            System.out.println("Title: " + driver.getTitle());
            // Internally this sends: GET /session/{id}/title
        } finally {
            driver.quit(); // Sends DELETE /session/{id}
        }
    }
}`,
    codeLanguage: 'java',
    realWorldExample: 'When a test fails with "Connection refused", it means the browser driver process crashed or was not started. Understanding the 3-layer architecture immediately tells you to check if ChromeDriver is running on the correct port.',
    commonMistakes: [
      'Using driver.close() instead of driver.quit() — close() only closes the current window, quit() terminates the entire browser session',
      'Not matching ChromeDriver version with Chrome browser version',
      'Not setting up PATH for browser drivers (Selenium 4 Selenium Manager handles this automatically)',
      'Creating a new WebDriver instance in every test method without cleanup',
    ],
    bestPractices: [
      'Always call driver.quit() in an @AfterMethod or finally block',
      'Use Selenium Manager (Selenium 4.6+) to auto-download matching browser drivers',
      'Use headless mode for CI/CD pipelines for faster execution',
      'Implement WebDriver as a ThreadLocal variable for parallel execution',
      'Use WebDriverWait instead of Thread.sleep() for synchronization',
    ],
    interviewQuestions: [
      { q: 'What is the architecture of Selenium WebDriver?', a: 'Selenium WebDriver has three layers: client language bindings (Java/Python/etc.), the W3C WebDriver HTTP protocol, and browser-specific drivers (ChromeDriver, GeckoDriver). Test code sends HTTP requests to the browser driver, which translates them into native browser commands.' },
      { q: 'What is the difference between Selenium RC and Selenium WebDriver?', a: 'Selenium RC used a server proxy that injected JavaScript into the browser. WebDriver communicates directly with the browser through native APIs, making it faster, more reliable, and support modern browser features. Selenium RC is deprecated.' },
      { q: 'What changed between Selenium 3 and Selenium 4 in terms of protocol?', a: 'Selenium 4 fully adopts the W3C WebDriver standard, dropping legacy JSON Wire Protocol. It also introduced Selenium Grid 4 (with Docker support), BiDi Protocol support, relative locators, and built-in Selenium Manager for driver management.' },
    ],
    revisionSummary: 'WebDriver = Code → HTTP/JSON → BrowserDriver → Browser. Three layers. W3C protocol in Selenium 4. Each browser has its own driver. Always quit() after tests.',
    tags: ['selenium', 'webdriver', 'architecture', 'w3c', 'chromedriver'],
  },

  {
    id: 'page-object-model',
    moduleId: 'selenium-webdriver',
    title: 'Page Object Model (POM)',
    priority: 'hot',
    estimatedMinutes: 60,
    overview: 'Page Object Model is a design pattern that creates an object repository for web UI elements, separating test logic from page interactions.',
    whyItMatters: 'POM is the most widely adopted Selenium design pattern. It drastically reduces code duplication, makes tests maintainable, and is asked in virtually every SDET interview.',
    explanation: `**Page Object Model (POM)** is a design pattern where each web page (or component) is represented as a Java class. The class contains:
- **WebElements** (as fields)
- **Methods** that perform actions on those elements

**Without POM:**
Every test has findElement() calls scattered everywhere. Change one locator → update 50 tests.

**With POM:**
Locators are defined once in the page class. Tests call page methods. Change one locator → update one place.

**POM Structure:**
\`\`\`
src/
├── pages/
│   ├── LoginPage.java       ← Page class with elements + methods
│   ├── DashboardPage.java
│   └── CheckoutPage.java
├── tests/
│   ├── LoginTest.java       ← Test class using page methods
│   └── CheckoutTest.java
└── utils/
    └── DriverManager.java
\`\`\`

**PageFactory** is a Selenium utility that initializes WebElements lazily using @FindBy annotations, used with POM.`,
    keyPoints: [
      'Each page = one Java class with WebElements and action methods',
      'Tests should NOT contain findElement() calls — only page method calls',
      'PageFactory.initElements() initializes @FindBy annotated elements',
      'Returns page objects from action methods for fluent method chaining',
      'POM reduces code duplication and makes maintenance easier',
      'Extend BasePage for shared methods (wait, scroll, screenshot)',
    ],
    codeExample: `// BasePage.java
public class BasePage {
    protected WebDriver driver;
    protected WebDriverWait wait;
    
    public BasePage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        PageFactory.initElements(driver, this);
    }
    
    protected void waitAndClick(WebElement element) {
        wait.until(ExpectedConditions.elementToBeClickable(element)).click();
    }
}

// LoginPage.java
public class LoginPage extends BasePage {
    @FindBy(id = "username")
    private WebElement usernameField;
    
    @FindBy(id = "password")
    private WebElement passwordField;
    
    @FindBy(css = "button[type='submit']")
    private WebElement loginButton;
    
    @FindBy(className = "error-message")
    private WebElement errorMessage;
    
    public LoginPage(WebDriver driver) {
        super(driver);
    }
    
    public DashboardPage login(String username, String password) {
        usernameField.clear();
        usernameField.sendKeys(username);
        passwordField.sendKeys(password);
        waitAndClick(loginButton);
        return new DashboardPage(driver);
    }
    
    public String getErrorMessage() {
        return wait.until(ExpectedConditions.visibilityOf(errorMessage)).getText();
    }
}

// LoginTest.java (TestNG)
public class LoginTest {
    private WebDriver driver;
    private LoginPage loginPage;
    
    @BeforeMethod
    public void setUp() {
        driver = new ChromeDriver();
        driver.get("https://example.com/login");
        loginPage = new LoginPage(driver);
    }
    
    @Test
    public void testValidLogin() {
        DashboardPage dashboard = loginPage.login("admin", "password123");
        Assert.assertTrue(dashboard.isLoaded(), "Dashboard should load after login");
    }
    
    @Test
    public void testInvalidLogin() {
        loginPage.login("admin", "wrongpassword");
        Assert.assertEquals(loginPage.getErrorMessage(), "Invalid credentials");
    }
    
    @AfterMethod
    public void tearDown() {
        if (driver != null) driver.quit();
    }
}`,
    codeLanguage: 'java',
    realWorldExample: 'A banking application has 50 test cases testing the login page. When the login button ID changes from "btnLogin" to "login-submit", with POM you update just the LoginPage class — all 50 tests automatically work. Without POM, you would need to update 50 individual test files.',
    commonMistakes: [
      'Putting test assertions inside page classes — pages should only have actions, not assertions',
      'Not using PageFactory — manually calling findElement() in page classes negates lazy initialization',
      'Making page methods too granular (one method per click) instead of user-action-oriented',
      'Not returning a new Page object from methods that navigate to a new page',
      'Creating page objects as static — breaks parallel execution',
    ],
    bestPractices: [
      'Follow the Single Responsibility Principle — one page class per page/component',
      'Return page objects from navigation methods for fluent chaining',
      'Extend BasePage for common utilities like wait, scroll, screenshot',
      'Use meaningful method names that describe user actions, not technical operations',
      'Keep page objects independent of test data — pass data as parameters',
    ],
    interviewQuestions: [
      { q: 'What is Page Object Model and why is it used?', a: 'POM is a design pattern where each web page is a Java class with WebElements and action methods. It separates test logic from page interactions, reducing duplication and making maintenance easier. When a locator changes, you update only the page class, not all tests.' },
      { q: 'What is PageFactory in Selenium?', a: 'PageFactory is a Selenium support class that initializes WebElements annotated with @FindBy lazily (when they are first accessed, not when the page object is created). It is used with initElements() in the constructor.' },
      { q: 'What is the difference between @FindBy and driver.findElement()?', a: '@FindBy with PageFactory initializes elements lazily and can be reinitiated if the DOM changes. driver.findElement() finds the element immediately and throws NoSuchElementException if not found. @FindBy creates a proxy that finds the element fresh each time it is used.' },
    ],
    revisionSummary: 'POM = one class per page, WebElements + action methods. PageFactory initializes @FindBy elements lazily. Tests call page methods, never findElement(). Reduces duplication, improves maintenance.',
    tags: ['pom', 'page-object-model', 'pagefactory', 'design-pattern', 'selenium'],
  },

  {
    id: 'implicit-explicit-fluent-waits',
    moduleId: 'selenium-webdriver',
    title: 'Implicit, Explicit & Fluent Waits',
    priority: 'hot',
    estimatedMinutes: 50,
    overview: 'Waits are synchronization mechanisms in Selenium that pause execution until a condition is met or a timeout occurs, preventing flaky tests due to timing issues.',
    whyItMatters: 'Improper waits are the #1 cause of flaky tests in Selenium automation. Understanding the three types of waits and when to use each is critical for stable automation.',
    explanation: `**1. Implicit Wait**
Sets a global timeout for the entire WebDriver session. When findElement() is called and the element is not immediately found, the driver will poll the DOM up to the timeout duration.

- Set once, applies everywhere
- Applied globally to all findElement() calls
- Cannot be set per-condition or per-element

**2. Explicit Wait (WebDriverWait + ExpectedConditions)**
Waits for a specific condition to be true before proceeding. Applied to specific elements/conditions.

- Set per element or condition
- Uses ExpectedConditions (visibilityOf, clickable, etc.)
- More precise than implicit wait
- **Preferred approach** for modern Selenium

**3. Fluent Wait**
An extension of WebDriverWait that allows you to configure polling frequency and ignore specific exceptions during the wait.

- Custom polling interval (e.g., poll every 500ms)
- Ignore specific exceptions during polling
- Most flexible of the three

**Key Rule: NEVER mix implicit and explicit waits.** It can cause unpredictable wait times because explicit wait adds on top of implicit wait in some scenarios.`,
    keyPoints: [
      'Implicit wait = global, applied to all findElement() calls',
      'Explicit wait = per condition, uses ExpectedConditions',
      'Fluent wait = like explicit but with custom polling interval and ignored exceptions',
      'Never mix implicit and explicit waits — causes unpredictable behavior',
      'Thread.sleep() is a hard sleep — NEVER use it in automation (bad practice)',
      'Explicit waits using WebDriverWait are the recommended approach',
    ],
    codeExample: `// ❌ BAD: Thread.sleep — hard-coded delay
Thread.sleep(5000); // Always waits 5 seconds even if element appears in 1 second

// ✅ IMPLICIT WAIT — set once for the session
WebDriver driver = new ChromeDriver();
driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
// All findElement() calls will wait up to 10 seconds

// ✅ EXPLICIT WAIT — wait for specific condition
WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(15));

// Wait until element is visible
WebElement element = wait.until(
    ExpectedConditions.visibilityOfElementLocated(By.id("username"))
);

// Wait until element is clickable
wait.until(ExpectedConditions.elementToBeClickable(By.id("submit"))).click();

// Wait until text is present
wait.until(ExpectedConditions.textToBePresentInElementLocated(
    By.id("status"), "Success"
));

// Wait until alert is present
wait.until(ExpectedConditions.alertIsPresent());

// ✅ FLUENT WAIT — most flexible
Wait<WebDriver> fluentWait = new FluentWait<>(driver)
    .withTimeout(Duration.ofSeconds(30))      // Max wait time
    .pollingEvery(Duration.ofMillis(500))      // Poll every 500ms
    .ignoring(NoSuchElementException.class)    // Ignore this exception
    .ignoring(StaleElementReferenceException.class);

WebElement element2 = fluentWait.until(driver -> {
    return driver.findElement(By.id("dynamic-element"));
});`,
    codeLanguage: 'java',
    realWorldExample: 'In an e-commerce checkout flow, after clicking "Place Order", a confirmation message appears asynchronously. Using explicit wait with ExpectedConditions.visibilityOfElementLocated() waits exactly until the message appears (could be 1s or 10s), making the test both fast and reliable.',
    commonMistakes: [
      'Using Thread.sleep() — wastes time when elements appear faster',
      'Mixing implicit and explicit waits — creates compounded wait times',
      'Setting implicit wait to 0 to use explicit waits but forgetting some findElement() calls',
      'Using too short a timeout in CI/CD where servers are slower',
      'Not ignoring StaleElementReferenceException in FluentWait for dynamic content',
    ],
    bestPractices: [
      'Use explicit waits as the primary synchronization strategy',
      'Create a reusable waitForElement() utility method in BasePage',
      'Set reasonable timeouts based on environment (local=10s, CI=20s)',
      'Always use ExpectedConditions.elementToBeClickable() before clicking',
      'Use FluentWait for dynamic content that has unpredictable load times',
    ],
    interviewQuestions: [
      { q: 'What is the difference between implicit and explicit wait?', a: 'Implicit wait is a global timeout set for the WebDriver session that applies to all findElement() calls. Explicit wait (WebDriverWait) waits for a specific condition and is applied to particular elements. Explicit waits are more precise and preferred.' },
      { q: 'What is FluentWait and how is it different from WebDriverWait?', a: 'FluentWait extends WebDriverWait and adds the ability to set a custom polling interval (how often to check the condition) and specify exceptions to ignore during polling. It is more flexible than WebDriverWait.' },
      { q: 'Why should you not mix implicit and explicit waits?', a: 'Mixing them causes unpredictable behavior. When explicit wait is used, it may add time on top of implicit wait because the driver first waits the implicit timeout for findElement(), then the explicit condition timeout runs. This can cause tests to wait 2x the intended time.' },
    ],
    revisionSummary: 'Implicit = global for all findElement(). Explicit = per condition via ExpectedConditions. Fluent = explicit + custom polling + ignore exceptions. Never mix implicit + explicit. Never use Thread.sleep().',
    tags: ['waits', 'implicit-wait', 'explicit-wait', 'fluent-wait', 'synchronization', 'selenium'],
  },

  {
    id: 'dynamic-xpath-patterns',
    moduleId: 'selenium-webdriver',
    title: 'Dynamic XPath Patterns',
    priority: 'hot',
    estimatedMinutes: 55,
    overview: 'Dynamic XPath expressions use functions and axes to locate elements whose attributes change at runtime, unlike static XPath that relies on fixed attribute values.',
    whyItMatters: 'Modern web applications use dynamic IDs and class names that change on every page load. Dynamic XPath is the primary way to locate such elements reliably.',
    explanation: `**What is Dynamic XPath?**
When element attributes like id="user_12345" change dynamically (12345 being a session-specific number), static XPath fails. Dynamic XPath uses partial matching functions and relationship axes.

**XPath Functions:**
- \`contains(@attr, 'value')\` — partial match on attribute value
- \`starts-with(@attr, 'value')\` — element whose attribute starts with value
- \`text()='value'\` — match by exact text content
- \`contains(text(), 'value')\` — partial text match
- \`normalize-space(text())='value'\` — trim whitespace then match

**XPath Axes (navigating the DOM tree):**
- \`parent::\` — direct parent
- \`ancestor::\` — any ancestor
- \`child::\` — direct children
- \`following-sibling::\` — siblings after current node
- \`preceding-sibling::\` — siblings before current node
- \`following::\` — all nodes after current (in document order)
- \`preceding::\` — all nodes before current
- \`descendant::\` — all descendants

**Absolute vs Relative XPath:**
- Absolute: \`/html/body/div[2]/form/input[1]\` — starts from root, brittle
- Relative: \`//input[@id='username']\` — starts from anywhere, preferred`,
    keyPoints: [
      'contains() for partial attribute matching — most commonly used',
      'starts-with() for elements with ID prefixes that are consistent',
      'text() for matching visible text content',
      'XPath axes (following-sibling, ancestor, parent) for navigating DOM relationships',
      'Relative XPath (//) is always preferred over absolute XPath (/html/body/...)',
      'Combine multiple conditions with and/or operators',
    ],
    codeExample: `// ── XPATH FUNCTIONS ──────────────────────────────────────────────

// contains() — partial attribute match
driver.findElement(By.xpath("//input[contains(@id, 'user')]"));
driver.findElement(By.xpath("//div[contains(@class, 'error')]"));

// starts-with()
driver.findElement(By.xpath("//input[starts-with(@name, 'login')]"));

// text() — exact text
driver.findElement(By.xpath("//button[text()='Submit']"));
driver.findElement(By.xpath("//span[contains(text(), 'Hello')]"));

// AND / OR conditions
driver.findElement(By.xpath(
    "//input[@type='text' and @placeholder='Enter email']"
));
driver.findElement(By.xpath(
    "//button[@id='btn1' or @id='btn2']"
));

// ── XPATH AXES ────────────────────────────────────────────────────

// following-sibling — find element after a known element
// HTML: <label>Username</label><input id="user_xyz"/>
driver.findElement(By.xpath(
    "//label[text()='Username']/following-sibling::input"
));

// ancestor — go up the tree
// Find the parent table row of a specific cell
driver.findElement(By.xpath(
    "//td[text()='John Doe']/ancestor::tr"
));

// parent — direct parent
driver.findElement(By.xpath("//input[@id='email']/parent::div"));

// child — direct child
driver.findElement(By.xpath("//form[@id='loginForm']/child::input[1]"));

// preceding-sibling
driver.findElement(By.xpath(
    "//input[@id='password']/preceding-sibling::label"
));

// ── REAL DYNAMIC SCENARIOS ────────────────────────────────────────

// Dynamic ID: id="react-select-3-input" — use contains
driver.findElement(By.xpath("//input[contains(@id, 'react-select')]"));

// Table row by cell value (find row where name is 'Alice')
driver.findElement(By.xpath(
    "//table//tr[td[text()='Alice']]/td[3]" // Get 3rd cell from Alice's row
));

// Index-based when multiple matches
driver.findElement(By.xpath("(//button[@class='btn-primary'])[2]"));`,
    codeLanguage: 'java',
    realWorldExample: 'An Angular application generates IDs like "mat-input-0", "mat-input-1" that change depending on component load order. Using contains(@id, "mat-input") finds these reliably. Or using the label text as an anchor and following-sibling::input to find the associated input.',
    commonMistakes: [
      'Using absolute XPath (/html/body/div[1]/...) — breaks with any UI change',
      'Not using contains() for dynamic IDs — causes NoSuchElementException',
      'XPath with index [1] without understanding — may grab wrong element',
      'Overly complex XPath with 5+ axes — use CSS selector instead',
      'Not testing XPath in browser DevTools before using in code',
    ],
    bestPractices: [
      'Always prefer relative XPath (starts with //) over absolute',
      'Test XPath in Chrome DevTools console: $x("//your/xpath")',
      'Use CSS selectors when possible — they are faster than XPath',
      'Prefer stable attributes (data-testid, aria-label) over dynamic ones',
      'Use meaningful anchors (visible text, labels) rather than brittle indices',
    ],
    interviewQuestions: [
      { q: 'What is the difference between absolute and relative XPath?', a: 'Absolute XPath starts from the root element (/html/body/...) and is brittle — any UI change breaks it. Relative XPath starts with // and searches from anywhere in the DOM, making it more resilient to UI changes.' },
      { q: 'How do you handle elements with dynamic IDs in Selenium?', a: 'Use XPath functions like contains(@id, "static-prefix") or starts-with(@id, "prefix"). Alternatively, use following-sibling, preceding-sibling axes to navigate from a known stable element, or use data-testid attributes if developers provide them.' },
      { q: 'What are XPath axes?', a: 'XPath axes define the relationship between the current node and the nodes to select. Common axes: parent (direct parent), ancestor (all ancestors), following-sibling (siblings after current node), preceding-sibling (siblings before), child (direct children), descendant (all descendants).' },
    ],
    revisionSummary: 'Dynamic XPath uses contains(), starts-with(), text(). Axes: following-sibling, preceding-sibling, ancestor, parent, child. Always use relative XPath (//). Test XPath in DevTools with $x().',
    tags: ['xpath', 'dynamic-xpath', 'xpath-axes', 'css-selectors', 'selenium'],
  },

  {
    id: 'stale-element-reference',
    moduleId: 'selenium-webdriver',
    title: 'StaleElementReferenceException',
    priority: 'hot',
    estimatedMinutes: 45,
    overview: 'StaleElementReferenceException is thrown when a WebElement reference is no longer valid because the DOM was refreshed or the element was recreated after the reference was taken.',
    whyItMatters: 'This is one of the most common Selenium exceptions in real-world automation, especially in Single Page Applications (SPAs). Every SDET is expected to know how to handle it.',
    explanation: `**What causes StaleElementReferenceException?**
When you find a WebElement with findElement(), Selenium stores a reference to that DOM node. If the DOM is then modified (AJAX refresh, navigation, SPA re-render), that DOM node may be destroyed and recreated. The stored reference now points to a "stale" (old) element that no longer exists in the DOM.

**Common Scenarios:**
1. Page refresh after findElement()
2. AJAX call that updates part of the DOM
3. React/Angular component re-rendering
4. Navigating back and forward
5. JavaScript that replaces DOM nodes

**Handling Strategies:**

1. **Re-find the element** — Store the locator, not the element
2. **WebDriverWait with ignoredExceptions** — Retry until element is fresh
3. **FluentWait ignoring StaleElementReferenceException**
4. **Custom retry logic**
5. **JavaScriptExecutor as a fallback**`,
    keyPoints: [
      'Thrown when a WebElement reference becomes invalid after DOM modification',
      'Common in SPAs using React, Angular, Vue due to virtual DOM updates',
      'Solution: re-find the element instead of storing WebElement references long-term',
      'FluentWait can ignore StaleElementReferenceException during polling',
      'Store locators (By objects), not WebElements, when working with dynamic pages',
    ],
    codeExample: `// ❌ BAD — storing element reference long-term
WebElement button = driver.findElement(By.id("submit"));
// ... some AJAX happens and the page partially refreshes ...
button.click(); // StaleElementReferenceException!

// ✅ SOLUTION 1: Re-find element fresh every time
By submitLocator = By.id("submit");
// ... some AJAX happens ...
driver.findElement(submitLocator).click(); // Fresh find — works!

// ✅ SOLUTION 2: Retry wrapper method
public void clickWithRetry(By locator, int maxAttempts) {
    int attempts = 0;
    while (attempts < maxAttempts) {
        try {
            driver.findElement(locator).click();
            return;
        } catch (StaleElementReferenceException e) {
            attempts++;
            if (attempts == maxAttempts) throw e;
        }
    }
}

// ✅ SOLUTION 3: FluentWait ignoring StaleElementReferenceException
Wait<WebDriver> wait = new FluentWait<>(driver)
    .withTimeout(Duration.ofSeconds(10))
    .pollingEvery(Duration.ofMillis(500))
    .ignoring(StaleElementReferenceException.class);

wait.until(driver -> {
    driver.findElement(By.id("submit")).click();
    return true;
});

// ✅ SOLUTION 4: WebDriverWait with refresh
WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
wait.ignoring(StaleElementReferenceException.class)
    .until(ExpectedConditions.elementToBeClickable(By.id("submit")));`,
    codeLanguage: 'java',
    realWorldExample: 'In a React-based admin dashboard, a table re-renders every 5 seconds with fresh data. If you find a table row element and then the table refreshes before you click a button in that row, you get StaleElementReferenceException. Solution: re-find the row using its unique data attribute each time.',
    commonMistakes: [
      'Storing WebElement references at class level in page objects (they go stale)',
      'Not using ignoring(StaleElementReferenceException.class) in FluentWait',
      'Using Thread.sleep() to "wait for the page to settle" — not reliable',
      'Catching StaleElementReferenceException but not re-finding the element',
    ],
    bestPractices: [
      'Never store WebElement references between method calls in dynamic pages',
      'Use @FindBy with PageFactory — elements are re-found on each access',
      'Add StaleElementReferenceException to your FluentWait ignored exceptions',
      'Implement a click() retry utility in your BasePage class',
    ],
    interviewQuestions: [
      { q: 'What is StaleElementReferenceException and how do you handle it?', a: 'It is thrown when a WebElement reference is no longer valid because the DOM was modified after the element was found. Handle it by: 1) Re-finding the element before interacting, 2) Using FluentWait with ignoring(StaleElementReferenceException.class), 3) Implementing a retry mechanism.' },
      { q: 'When does StaleElementReferenceException commonly occur?', a: 'In SPAs (React, Angular, Vue) when components re-render, after AJAX calls update the DOM, after page navigation, or when JavaScript replaces DOM nodes. It is very common in modern web applications.' },
    ],
    revisionSummary: 'StaleElementReferenceException = DOM modified after element was found. Fix: re-find element, use FluentWait.ignoring(), store By locators not WebElements.',
    tags: ['stale-element', 'exception', 'selenium', 'spa', 'dynamic-dom'],
  },

  {
    id: 'testng-annotations',
    moduleId: 'selenium-webdriver',
    title: 'TestNG Annotations',
    priority: 'hot',
    estimatedMinutes: 55,
    overview: 'TestNG annotations control the execution lifecycle of test methods, defining setup, teardown, and test configuration in a structured order.',
    whyItMatters: 'TestNG is the primary test framework used with Selenium in enterprise Java projects. Mastering annotations is fundamental to writing any Selenium automation framework.',
    explanation: `**TestNG Annotation Execution Order:**

\`@BeforeSuite → @BeforeTest → @BeforeClass → @BeforeMethod → @Test → @AfterMethod → @AfterClass → @AfterTest → @AfterSuite\`

**Annotation Descriptions:**

| Annotation | Runs | Typical Use |
|---|---|---|
| @BeforeSuite | Once before all tests in suite | Initialize ExtentReports |
| @AfterSuite | Once after all tests in suite | Close reports, cleanup |
| @BeforeTest | Before each \`<test>\` tag in testng.xml | Set base URL |
| @AfterTest | After each \`<test>\` tag | Log test results |
| @BeforeClass | Once before first @Test in class | Initialize common data |
| @AfterClass | Once after last @Test in class | Cleanup class resources |
| @BeforeMethod | Before every @Test method | Launch browser |
| @AfterMethod | After every @Test method | Quit browser |
| @Test | Test method | Actual test logic |
| @DataProvider | Returns Object[][] for parameterized tests | Supply test data |
| @Parameters | Inject values from testng.xml | Environment/browser |
| @Listeners | Register ITestListener implementations | Reporting |

**Priority:** Controls execution order within a class. Lower number = runs first. Default priority = 0.

**Groups:** Categorize tests. Can include/exclude groups in testng.xml.`,
    keyPoints: [
      'BeforeMethod runs before EVERY test method — use for browser setup',
      'BeforeClass runs once before first test in the class — use for class-level setup',
      'AfterMethod runs after EVERY test — use for browser quit',
      '@DataProvider allows parameterized testing with Object[][] data',
      'priority attribute controls execution order (lower = earlier)',
      'groups attribute categorizes tests for selective execution',
      'alwaysRun = true ensures setup runs even if dependent tests fail',
    ],
    codeExample: `@Listeners({TestListener.class, ExtentReportListener.class})
public class LoginTest extends BaseTest {

    // ── LIFECYCLE ──────────────────────────────────────────────────────
    
    @BeforeClass(alwaysRun = true)
    public void initClass() {
        System.out.println("Setting up test class: " + this.getClass().getName());
        // Initialize class-level resources
    }
    
    @BeforeMethod(alwaysRun = true)
    public void setUp(Method method) {
        // method parameter gives the current test method name
        System.out.println("Starting test: " + method.getName());
        initDriver(); // from BaseTest
    }
    
    @AfterMethod(alwaysRun = true)
    public void tearDown(ITestResult result) {
        if (result.getStatus() == ITestResult.FAILURE) {
            takeScreenshot(result.getName()); // Capture on failure
        }
        quitDriver();
    }
    
    @AfterClass(alwaysRun = true)
    public void cleanUp() {
        System.out.println("Test class complete");
    }
    
    // ── TEST METHODS ───────────────────────────────────────────────────
    
    @Test(priority = 1, groups = {"smoke", "regression"}, 
          description = "Verify valid login")
    public void testValidLogin() {
        LoginPage loginPage = new LoginPage(driver);
        DashboardPage dashboard = loginPage.login("admin", "password");
        Assert.assertTrue(dashboard.isDisplayed());
    }
    
    @Test(priority = 2, groups = {"regression"}, 
          dependsOnMethods = {"testValidLogin"})
    public void testLogout() {
        // Runs only if testValidLogin passes
        DashboardPage dashboard = new DashboardPage(driver);
        dashboard.logout();
        Assert.assertTrue(new LoginPage(driver).isLoginFormVisible());
    }
    
    // ── DATA PROVIDER ─────────────────────────────────────────────────
    
    @DataProvider(name = "loginData", parallel = true)
    public Object[][] loginData() {
        return new Object[][] {
            {"user1@test.com", "pass1", true},   // valid login
            {"user2@test.com", "wrong", false},   // invalid password
            {"", "pass1", false},                 // empty username
            {"invalid", "pass1", false}           // invalid username format
        };
    }
    
    @Test(dataProvider = "loginData", groups = {"regression"})
    public void testLoginWithData(String username, String password, boolean shouldSucceed) {
        LoginPage loginPage = new LoginPage(driver);
        loginPage.login(username, password);
        if (shouldSucceed) {
            Assert.assertTrue(new DashboardPage(driver).isDisplayed());
        } else {
            Assert.assertNotNull(loginPage.getErrorMessage());
        }
    }
    
    // ── PARAMETERS FROM testng.xml ────────────────────────────────────
    
    @Test
    @Parameters({"browser", "environment"})
    public void testWithParameters(
            @Optional("chrome") String browser,
            @Optional("staging") String environment) {
        System.out.println("Running on: " + browser + " | " + environment);
    }
}`,
    codeLanguage: 'java',
    realWorldExample: 'In a CI/CD pipeline, @BeforeSuite initializes the ExtentReport. @BeforeMethod launches Chrome in headless mode and navigates to the test URL. @AfterMethod takes a screenshot on failure and quits the browser. @AfterSuite finalizes and saves the report to disk.',
    commonMistakes: [
      'Using @BeforeClass for browser setup — means all tests in class share one browser instance (not parallel-safe)',
      'Forgetting alwaysRun = true in @AfterMethod — teardown skips if test throws exception',
      'Not using ITestResult in @AfterMethod to conditionally take screenshots',
      'Setting wrong priority order — lower number runs first, not higher',
      'Not making DataProvider parallel when running parallel tests',
    ],
    bestPractices: [
      'Use @BeforeMethod / @AfterMethod for browser setup/teardown for test isolation',
      'Always add alwaysRun = true to @Before/@After methods',
      'Use ITestResult in @AfterMethod to capture screenshots only on failures',
      'Group tests as "smoke", "regression", "sanity" for flexible execution',
      'Store DataProvider test data in external sources (Excel, JSON) using Apache POI',
    ],
    interviewQuestions: [
      { q: 'What is the execution order of TestNG annotations?', a: '@BeforeSuite → @BeforeTest → @BeforeClass → @BeforeMethod → @Test → @AfterMethod → @AfterClass → @AfterTest → @AfterSuite' },
      { q: 'What is @DataProvider in TestNG?', a: '@DataProvider returns an Object[][] that TestNG uses to run the same @Test method multiple times with different data. It supports parallel execution with parallel=true. The test method must accept the same parameters as the data provider returns.' },
      { q: 'What is the difference between @BeforeClass and @BeforeMethod?', a: '@BeforeClass runs once before the first test method in the class. @BeforeMethod runs before every single @Test method. For browser initialization, @BeforeMethod is preferred to ensure each test gets a fresh browser instance.' },
    ],
    revisionSummary: 'Order: BeforeSuite→BeforeTest→BeforeClass→BeforeMethod→Test→AfterMethod→AfterClass→AfterTest→AfterSuite. DataProvider supplies Object[][]. Priority: lower = runs first. Groups: smoke/regression. alwaysRun=true for setup/teardown.',
    tags: ['testng', 'annotations', 'dataprovider', 'lifecycle', 'beforemethod', 'aftermethod'],
  },

  // ─── MODULE 2: REST ASSURED ───────────────────────────────────────────────
  {
    id: 'given-when-then',
    moduleId: 'rest-assured',
    title: 'Given / When / Then Structure',
    priority: 'hot',
    estimatedMinutes: 45,
    overview: 'Rest Assured uses a BDD (Behavior Driven Development) syntax: given() for request setup, when() for the HTTP method call, and then() for response validation.',
    whyItMatters: 'This is the foundational syntax of Rest Assured that every API test is built on. It is readable, expressive, and maps directly to the three phases of any HTTP interaction.',
    explanation: `**Rest Assured BDD Syntax:**

\`\`\`
given()          → Set up the request (headers, body, auth, params)
    .when()      → Execute the HTTP call (get, post, put, delete)
    .then()      → Validate the response (status, body, headers)
\`\`\`

**Three Phases:**

1. **given()** — Request Specification
   - Headers (Content-Type, Authorization)
   - Request body (JSON, XML, form data)
   - Query parameters and path parameters
   - Authentication configuration
   - Base URL and base path

2. **when()** — HTTP Method Execution
   - .get("/endpoint")
   - .post("/endpoint")
   - .put("/endpoint")
   - .delete("/endpoint")
   - .patch("/endpoint")

3. **then()** — Response Validation
   - Status code assertion
   - Response body assertion (JSON/XML path)
   - Header assertion
   - Response time assertion
   - Extract values for chaining`,
    keyPoints: [
      'given() → request setup, when() → HTTP call, then() → validation',
      'Can chain: given().header().body().when().post().then().statusCode(200)',
      'RequestSpecification can be built and reused across tests',
      'then() returns ValidatableResponse which supports method chaining',
      'extract() after then() allows pulling out response values',
      'Rest Assured tests are essentially readable HTTP test scripts',
    ],
    codeExample: `import io.restassured.RestAssured;
import io.restassured.response.Response;
import static io.restassured.RestAssured.*;
import static org.hamcrest.Matchers.*;

public class ApiTest {

    @BeforeClass
    public static void setup() {
        RestAssured.baseURI = "https://reqres.in";
        RestAssured.basePath = "/api";
    }

    // ── GET REQUEST ───────────────────────────────────────────────────
    @Test
    public void testGetUser() {
        given()
            .header("Accept", "application/json")
        .when()
            .get("/users/2")
        .then()
            .statusCode(200)
            .body("data.id", equalTo(2))
            .body("data.first_name", equalTo("Janet"))
            .body("data.email", containsString("@reqres.in"))
            .time(lessThan(2000L)); // Response time < 2 seconds
    }

    // ── POST REQUEST ──────────────────────────────────────────────────
    @Test
    public void testCreateUser() {
        String requestBody = """
            {
                "name": "John Doe",
                "job": "SDET"
            }
            """;
        
        given()
            .contentType("application/json")
            .body(requestBody)
        .when()
            .post("/users")
        .then()
            .statusCode(201)
            .body("name", equalTo("John Doe"))
            .body("job", equalTo("SDET"))
            .body("id", notNullValue())
            .body("createdAt", notNullValue());
    }

    // ── EXTRACT RESPONSE ──────────────────────────────────────────────
    @Test
    public void testExtractUserId() {
        String userId = 
            given()
                .contentType("application/json")
                .body("{ \\"name\\": \\"Alice\\", \\"job\\": \\"Tester\\" }")
            .when()
                .post("/users")
            .then()
                .statusCode(201)
                .extract()
                .path("id");  // Extract specific field
        
        System.out.println("Created user ID: " + userId);
        Assert.assertNotNull(userId);
    }

    // ── EXTRACT FULL RESPONSE ─────────────────────────────────────────
    @Test  
    public void testExtractFullResponse() {
        Response response = 
            given()
                .queryParam("page", 2)
            .when()
                .get("/users")
            .then()
                .statusCode(200)
                .extract()
                .response();
        
        int total = response.jsonPath().getInt("total");
        List<String> emails = response.jsonPath().getList("data.email");
        System.out.println("Total users: " + total);
        System.out.println("Emails: " + emails);
    }
}`,
    codeLanguage: 'java',
    realWorldExample: 'Testing a user management REST API: given() provides the auth token and JSON content type header, when().post("/users") creates a new user, then().statusCode(201).body("id", notNullValue()) validates the creation was successful.',
    commonMistakes: [
      'Forgetting contentType("application/json") for POST/PUT requests',
      'Not setting baseURI globally — repeating it in every test',
      'Using then() before asserting — then() must come after when()',
      'Not using extract() when you need the response data in subsequent tests',
    ],
    bestPractices: [
      'Set RestAssured.baseURI in @BeforeClass to avoid repetition',
      'Use RequestSpecBuilder to create reusable request specifications',
      'Extract response values and assert them separately for better error messages',
      'Use logging: given().log().all() and then().log().ifError() for debugging',
    ],
    interviewQuestions: [
      { q: 'Explain the given/when/then structure in Rest Assured.', a: 'given() is the request specification phase where you set headers, body, auth, and parameters. when() executes the HTTP call (get/post/put/delete). then() validates the response (status code, body, headers). They chain together to form a complete API test.' },
      { q: 'How do you extract a value from a Rest Assured response?', a: 'Use .then().extract().path("jsonPath") to extract a specific field, or .extract().response() to get the full Response object and then use response.jsonPath().get("field") to extract values.' },
    ],
    revisionSummary: 'given()=request setup, when()=HTTP call, then()=validation. Chain: given().header().body().when().post().then().statusCode(201). Use extract().path() to pull values. Set baseURI globally.',
    tags: ['rest-assured', 'given-when-then', 'bdd', 'api-testing'],
  },

  {
    id: 'http-methods',
    moduleId: 'rest-assured',
    title: 'HTTP Methods (GET, POST, PUT, PATCH, DELETE)',
    priority: 'hot',
    estimatedMinutes: 40,
    overview: 'HTTP methods define the intent of an API request — whether you are retrieving, creating, updating, or deleting a resource.',
    whyItMatters: 'Understanding HTTP methods and their properties (idempotency, safety) is foundational for API testing. These are asked in every SDET and backend testing interview.',
    explanation: `**HTTP Methods Overview:**

| Method | Purpose | Has Body? | Idempotent | Safe |
|---|---|---|---|---|
| GET | Retrieve resource | No | Yes | Yes |
| POST | Create resource | Yes | No | No |
| PUT | Replace entire resource | Yes | Yes | No |
| PATCH | Partially update resource | Yes | No | No |
| DELETE | Remove resource | Optional | Yes | No |
| HEAD | Like GET but no body | No | Yes | Yes |
| OPTIONS | Get allowed methods | No | Yes | Yes |

**Idempotent:** Calling the same request multiple times produces the same result.
- GET /users/1 called 5 times → always returns the same user → Idempotent
- POST /users called 5 times → creates 5 users → NOT idempotent
- DELETE /users/1 called 5 times → after first call, user is gone → subsequent calls return 404 but the end state is the same → Idempotent

**Safe Methods:** Do not modify server state (GET, HEAD, OPTIONS).

**REST CRUD Mapping:**
- GET /users → List all users
- POST /users → Create a user
- GET /users/{id} → Get specific user
- PUT /users/{id} → Replace user completely
- PATCH /users/{id} → Update specific fields
- DELETE /users/{id} → Delete user`,
    keyPoints: [
      'GET = retrieve, POST = create, PUT = full replace, PATCH = partial update, DELETE = remove',
      'Idempotent methods: GET, PUT, DELETE, HEAD, OPTIONS (not POST, not PATCH)',
      'Safe methods do not modify server state: GET, HEAD, OPTIONS',
      'POST is not idempotent — multiple calls create multiple resources',
      'PUT requires sending the complete resource in the body',
      'PATCH only sends the fields that need to be changed',
    ],
    codeExample: `// ── GET — Retrieve ────────────────────────────────────────────────
given()
    .header("Authorization", "Bearer " + token)
    .queryParam("page", 1)
    .queryParam("size", 10)
.when()
    .get("/api/users")
.then()
    .statusCode(200)
    .body("users", hasSize(greaterThan(0)));

// ── POST — Create ──────────────────────────────────────────────────
String newUser = """
    {
        "firstName": "Alice",
        "lastName": "Smith",
        "email": "alice@test.com",
        "role": "TESTER"
    }
    """;
    
Response createResponse =
    given()
        .contentType("application/json")
        .body(newUser)
    .when()
        .post("/api/users")
    .then()
        .statusCode(201)
        .body("id", notNullValue())
        .extract().response();
        
String newUserId = createResponse.jsonPath().getString("id");

// ── PUT — Full Replace ─────────────────────────────────────────────
String updatedUser = """
    {
        "firstName": "Alice",
        "lastName": "Johnson",  
        "email": "alice.j@test.com",
        "role": "SENIOR_TESTER"
    }
    """; // Must send ALL fields

given()
    .contentType("application/json")
    .pathParam("id", newUserId)
    .body(updatedUser)
.when()
    .put("/api/users/{id}")
.then()
    .statusCode(200)
    .body("lastName", equalTo("Johnson"));

// ── PATCH — Partial Update ─────────────────────────────────────────
String partialUpdate = """
    {
        "role": "LEAD_SDET"
    }
    """; // Only the field(s) to update

given()
    .contentType("application/json")
    .pathParam("id", newUserId)
    .body(partialUpdate)
.when()
    .patch("/api/users/{id}")
.then()
    .statusCode(200)
    .body("role", equalTo("LEAD_SDET"))
    .body("email", equalTo("alice.j@test.com")); // Other fields unchanged

// ── DELETE — Remove ────────────────────────────────────────────────
given()
    .pathParam("id", newUserId)
.when()
    .delete("/api/users/{id}")
.then()
    .statusCode(204); // No content

// Verify deletion
given()
    .pathParam("id", newUserId)
.when()
    .get("/api/users/{id}")
.then()
    .statusCode(404);`,
    codeLanguage: 'java',
    realWorldExample: 'In a hotel booking API: GET /bookings lists all bookings. POST /bookings creates a new booking. PUT /bookings/{id} updates all booking details (dates, room, guest). PATCH /bookings/{id} only updates the check-in date. DELETE /bookings/{id} cancels the booking.',
    commonMistakes: [
      'Using POST instead of PUT for updates — POST creates new resources',
      'Confusing PUT (full replace) with PATCH (partial update)',
      'Assuming DELETE always returns 200 — it often returns 204 (No Content)',
      'Not sending Content-Type header for POST/PUT/PATCH requests',
      'Thinking PATCH is idempotent — it is generally not',
    ],
    bestPractices: [
      'Always verify response status codes match HTTP semantics (201 for creation, 204 for delete)',
      'Test idempotency of PUT: call twice with same data, verify same result',
      'Test POST idempotency violation: call twice, verify two resources are created',
      'Validate response headers, not just body (Content-Type, Location header on POST)',
    ],
    interviewQuestions: [
      { q: 'What is the difference between PUT and PATCH?', a: 'PUT replaces the entire resource — you must send all fields in the request body. PATCH partially updates a resource — you only send the fields you want to change. PUT is idempotent; PATCH is generally not.' },
      { q: 'What are idempotent HTTP methods?', a: 'Idempotent methods produce the same result no matter how many times they are called. GET, HEAD, PUT, DELETE, OPTIONS are idempotent. POST and PATCH are not idempotent — calling POST multiple times creates multiple resources.' },
      { q: 'What HTTP status code should a POST return on successful creation?', a: '201 Created, and ideally includes a Location header pointing to the new resource URL (e.g., Location: /api/users/123). Some APIs return 200 OK but 201 is more semantically correct per REST standards.' },
    ],
    revisionSummary: 'GET=read, POST=create(201), PUT=full replace, PATCH=partial update, DELETE=remove(204). Idempotent: GET/PUT/DELETE. Not idempotent: POST/PATCH. Safe: GET/HEAD/OPTIONS.',
    tags: ['http-methods', 'get', 'post', 'put', 'patch', 'delete', 'idempotent', 'rest'],
  },

  // ─── MODULE 3: APPIUM ─────────────────────────────────────────────────────
  {
    id: 'appium-server-architecture',
    moduleId: 'appium',
    title: 'Appium Server Architecture',
    priority: 'hot',
    estimatedMinutes: 50,
    overview: 'Appium is an open-source mobile automation framework that extends Selenium WebDriver protocol to automate native, hybrid, and web apps on iOS and Android.',
    whyItMatters: 'Appium is the industry standard for mobile test automation. Understanding its architecture explains how it differs from Selenium and how to set it up correctly.',
    explanation: `**Appium Architecture Components:**

**1. Appium Client Libraries**
Same as Selenium — Java, Python, JavaScript, Ruby clients. Use the WebDriver protocol extended with mobile-specific capabilities.

**2. Appium Server**
A Node.js server that:
- Accepts WebDriver protocol requests from client libraries
- Manages sessions and device connections
- Routes commands to appropriate drivers (XCUITest for iOS, UIAutomator2 for Android)

**3. Mobile Automation Drivers**
- **UIAutomator2** (Android) — Google's official Android automation framework
- **XCUITest** (iOS) — Apple's official iOS automation framework
- **Espresso** (Android) — Google's Android UI testing library (faster than UIAutomator2)
- **Mac2** (Mac desktop apps)

**4. Devices**
- Real physical devices (Android/iOS)
- Android Emulators (AVD)
- iOS Simulators

**Request Flow:**
Test Code → Appium Client → HTTP to Appium Server → Driver (UIAutomator2/XCUITest) → Device

**Appium 2.x Changes:**
- Drivers are now separate plugins (install separately)
- appium driver install uiautomator2
- appium driver install xcuitest`,
    keyPoints: [
      'Appium Server is a Node.js HTTP server that translates WebDriver calls to mobile commands',
      'UIAutomator2 for Android, XCUITest for iOS are the underlying automation frameworks',
      'Uses WebDriver protocol — same API style as Selenium but with mobile-specific commands',
      'Supports native (installed app), hybrid (embedded webview), and mobile web apps',
      'Appium 2.x has modular drivers — install them separately',
      'Desired Capabilities configure which device, platform, app to use',
    ],
    codeExample: `// ── ANDROID SETUP ─────────────────────────────────────────────────
import io.appium.java_client.android.AndroidDriver;
import io.appium.java_client.android.options.UiAutomator2Options;

public class AppiumTest {

    private AndroidDriver driver;

    @BeforeMethod
    public void setUp() throws MalformedURLException {
        UiAutomator2Options options = new UiAutomator2Options()
            .setDeviceName("Pixel_4_API_31")         // AVD or device name
            .setPlatformVersion("12.0")
            .setApp("/path/to/app.apk")               // APK path
            .setAppPackage("com.example.app")         // App package
            .setAppActivity("com.example.app.MainActivity") // Launch activity
            .setAutoGrantPermissions(true)            // Auto-accept permissions
            .setNewCommandTimeout(Duration.ofSeconds(60));
        
        driver = new AndroidDriver(
            new URL("http://localhost:4723"), // Appium server URL
            options
        );
    }

    @Test
    public void testLogin() {
        // Find elements using mobile locators
        driver.findElement(AppiumBy.accessibilityId("username-field"))
              .sendKeys("testuser");
        
        driver.findElement(AppiumBy.androidUIAutomator(
            "new UiSelector().text(\\"Login\\")"
        )).click();
        
        // Wait for home screen
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement homeScreen = wait.until(
            ExpectedConditions.visibilityOfElementLocated(
                AppiumBy.id("com.example.app:id/home_title")
            )
        );
        Assert.assertTrue(homeScreen.isDisplayed());
    }

    @AfterMethod
    public void tearDown() {
        if (driver != null) driver.quit();
    }
}`,
    codeLanguage: 'java',
    realWorldExample: 'At a bank, the mobile banking app needs to be tested on both Android and iOS. Appium allows the same test logic (with different capabilities) to run on both platforms. A CI/CD pipeline starts an Android emulator, runs Appium tests, then starts an iOS simulator and runs the same tests.',
    commonMistakes: [
      'Not starting the Appium server before running tests',
      'Wrong appPackage or appActivity causing app not to launch',
      'Using Selenium locators (By.id without package prefix) instead of Appium-specific ones',
      'Not setting automationName capability (UIAutomator2 for Android, XCUITest for iOS)',
    ],
    bestPractices: [
      'Use UiAutomator2Options/XCUITestOptions instead of raw DesiredCapabilities in Appium 2',
      'Use Appium Inspector to find locators on the device',
      'Use AccessibilityId (content-desc on Android, accessibility identifier on iOS) for cross-platform locators',
      'Set newCommandTimeout to prevent session timeout during long operations',
    ],
    interviewQuestions: [
      { q: 'How does Appium architecture work?', a: 'Appium is a Node.js server that accepts WebDriver protocol HTTP requests from client libraries. It routes commands to platform-specific drivers (UIAutomator2 for Android, XCUITest for iOS) which control the actual device. The architecture is similar to Selenium but adds a mobile automation layer.' },
      { q: 'What is the difference between Appium and Selenium?', a: 'Selenium automates web browsers (Chrome, Firefox). Appium automates mobile apps (native, hybrid) and uses mobile-specific frameworks (UIAutomator2, XCUITest). Appium extends the WebDriver protocol with mobile capabilities, so the API syntax is similar but Appium adds mobile-specific commands (gestures, capabilities).' },
    ],
    revisionSummary: 'Appium = Node.js server + mobile drivers (UIAutomator2 for Android, XCUITest for iOS). Same WebDriver protocol as Selenium. Supports native/hybrid/web apps. Desired Capabilities configure device+app.',
    tags: ['appium', 'mobile-testing', 'uiautomator2', 'xcuitest', 'android', 'ios'],
  },

  // ─── MODULE 4: REST, SOAP & WSDL ─────────────────────────────────────────
  {
    id: 'soap-vs-rest',
    moduleId: 'rest-soap-wsdl',
    title: 'SOAP vs REST',
    priority: 'hot',
    estimatedMinutes: 40,
    overview: 'SOAP (Simple Object Access Protocol) is a strict XML-based messaging protocol, while REST (Representational State Transfer) is an architectural style using standard HTTP methods.',
    whyItMatters: 'Understanding the fundamental differences between SOAP and REST is expected knowledge for any SDET interviewing at enterprise companies that use web services.',
    explanation: `**SOAP (Simple Object Access Protocol):**
- A **protocol** with strict specifications
- Uses **XML** for all messages
- Has its own error handling (SOAP Fault)
- Supports WS-Security, WS-ReliableMessaging (enterprise features)
- Works over HTTP, SMTP, TCP
- Contract-first development using WSDL
- Stateful or stateless

**REST (Representational State Transfer):**
- An **architectural style**, not a protocol
- Can use JSON, XML, HTML, plain text
- Uses HTTP status codes for errors
- Stateless by constraint
- Uses HTTP methods (GET, POST, PUT, DELETE)
- No strict contract (though OpenAPI/Swagger is common)

| Feature | SOAP | REST |
|---|---|---|
| Format | XML only | JSON, XML, HTML, etc. |
| Protocol | Protocol | Architecture style |
| Transport | HTTP, SMTP, TCP | HTTP only |
| Security | WS-Security built-in | OAuth, JWT, HTTPS |
| Error handling | SOAP Fault XML | HTTP status codes |
| Contract | WSDL (required) | OpenAPI (optional) |
| Performance | Slower (XML overhead) | Faster (JSON) |
| State | Stateful or stateless | Stateless |
| Use case | Enterprise, banking, healthcare | Public APIs, mobile, web |`,
    keyPoints: [
      'SOAP is a protocol; REST is an architectural style',
      'SOAP uses XML only; REST supports JSON, XML, and other formats',
      'SOAP has WS-Security built-in; REST relies on HTTPS + OAuth/JWT',
      'SOAP has WSDL contract (machine-readable); REST uses OpenAPI (optional)',
      'SOAP Fault for errors; REST uses HTTP status codes',
      'SOAP is preferred in banking, healthcare, enterprise; REST for web/mobile APIs',
    ],
    codeExample: `// ── SOAP REQUEST EXAMPLE ──────────────────────────────────────────
// SOAP messages are XML with envelope structure
/*
POST /WeatherService HTTP/1.1
Content-Type: text/xml; charset=utf-8
SOAPAction: "GetWeather"

<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope
    xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
    xmlns:weath="http://www.example.com/weather">
    <soap:Header>
        <weath:Authentication>
            <weath:Username>user</weath:Username>
            <weath:Password>pass</weath:Password>
        </weath:Authentication>
    </soap:Header>
    <soap:Body>
        <weath:GetWeather>
            <weath:City>New York</weath:City>
        </weath:GetWeather>
    </soap:Body>
</soap:Envelope>
*/

// ── TESTING SOAP WITH REST ASSURED ────────────────────────────────
@Test
public void testSoapWeatherService() {
    String soapBody = """
        <?xml version="1.0" encoding="UTF-8"?>
        <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
            <soap:Body>
                <GetWeather xmlns="http://www.example.com/weather">
                    <City>New York</City>
                </GetWeather>
            </soap:Body>
        </soap:Envelope>
        """;
    
    given()
        .contentType("text/xml; charset=UTF-8")
        .header("SOAPAction", "GetWeather")
        .body(soapBody)
    .when()
        .post("http://www.example.com/WeatherService")
    .then()
        .statusCode(200)
        .body("Envelope.Body.GetWeatherResponse.Temperature", 
              notNullValue());
}

// ── REST EQUIVALENT ───────────────────────────────────────────────
// Same functionality in REST:
// GET https://api.weather.com/v1/weather?city=New+York
// Response: { "city": "New York", "temperature": 72, "unit": "F" }`,
    codeLanguage: 'java',
    realWorldExample: 'A banking system uses SOAP for inter-bank transactions because SOAP\'s WS-Security provides built-in message-level encryption, digital signatures, and reliable messaging — critical for financial transactions. The bank\'s customer-facing mobile app uses REST (JSON) because it is lighter and faster.',
    commonMistakes: [
      'Saying REST is a protocol — it is an architectural style',
      'Thinking REST is always better — SOAP is essential in enterprise/regulated industries',
      'Forgetting SOAPAction header when testing SOAP services',
      'Using Content-Type: application/json for SOAP — must be text/xml',
    ],
    bestPractices: [
      'Use SoapUI tool for testing SOAP services (generates requests from WSDL)',
      'Rest Assured can test SOAP services by sending XML body with text/xml content type',
      'Always validate SOAP Fault responses (error scenarios)',
      'Use WSDL to understand the contract before writing SOAP tests',
    ],
    interviewQuestions: [
      { q: 'What is the difference between SOAP and REST?', a: 'SOAP is a protocol using XML for messages, with strict contract (WSDL), built-in WS-Security, and works over multiple transports. REST is an architectural style using HTTP with any format (usually JSON), stateless, no strict contract, uses HTTP status codes for errors. REST is faster and simpler; SOAP is more enterprise-grade with built-in security and reliability features.' },
      { q: 'When would you choose SOAP over REST?', a: 'Choose SOAP when: 1) You need built-in message-level security (WS-Security) for banking/healthcare, 2) You need ACID transactions and reliable messaging, 3) The existing system uses WSDL contracts, 4) Enterprise SOA architecture is in place.' },
    ],
    revisionSummary: 'SOAP=protocol+XML+WSDL+WS-Security+SOAP Fault. REST=architecture+HTTP+JSON+stateless+status codes. SOAP for enterprise/regulated. REST for web/mobile APIs.',
    tags: ['soap', 'rest', 'wsdl', 'web-services', 'api'],
  },

  // ─── MODULE 5: PERFORMANCE TESTING ───────────────────────────────────────
  {
    id: 'load-stress-spike-soak',
    moduleId: 'performance-testing',
    title: 'Load vs Stress vs Spike vs Soak Testing',
    priority: 'hot',
    estimatedMinutes: 45,
    overview: 'Different performance test types simulate different real-world usage patterns to identify system behavior under various load conditions.',
    whyItMatters: 'Interviewers frequently ask candidates to differentiate between performance test types. These are fundamental concepts for any SDET role involving performance testing.',
    explanation: `**Types of Performance Tests:**

**1. Load Testing**
- Tests system under **expected normal load**
- Goal: Verify system performs acceptably under typical usage
- Example: 500 concurrent users during business hours
- Validates: Response times, throughput, error rate under normal conditions

**2. Stress Testing**
- Tests system **beyond normal capacity** to find the breaking point
- Goal: Find maximum load the system can handle before failure
- Example: Gradually increase from 500 → 1000 → 2000 users until system fails
- Validates: System limits, failure behavior, recovery after failure

**3. Spike Testing**
- Tests system with **sudden large increases** in load (spikes)
- Goal: Verify system handles sudden traffic surges (flash sales, news events)
- Example: Instantly jump from 100 to 10,000 users, then back to 100
- Validates: Auto-scaling, circuit breakers, graceful degradation

**4. Soak Testing (Endurance Testing)**
- Tests system under **sustained normal load for extended period** (hours/days)
- Goal: Find memory leaks, connection pool exhaustion, performance degradation over time
- Example: 500 users for 24 hours
- Validates: Memory management, connection handling, stability over time

**5. Volume Testing**
- Tests with **large amounts of data** (not users)
- Example: Database with 10 million records vs 100 records

**6. Scalability Testing**
- Tests system's ability to **scale up/down** with load`,
    keyPoints: [
      'Load testing = normal expected load to verify baseline performance',
      'Stress testing = beyond capacity to find breaking point',
      'Spike testing = sudden burst of users (flash sales, viral events)',
      'Soak testing = extended duration to find memory leaks / gradual degradation',
      'Throughput = requests per second. Latency = time for first byte. Response time = total time.',
      'All these tests can be designed in JMeter using Thread Group configurations',
    ],
    codeExample: `// JMeter concepts expressed as pseudo-configuration:

/*
── LOAD TEST CONFIGURATION ──────────────────────────────────────────
Thread Group:
  Number of Threads: 500       (concurrent users)
  Ramp-Up Period: 60 seconds   (gradually add users over 60s)
  Loop Count: Forever
  Duration: 1800 seconds       (30 minutes)
  
Expected: All requests respond within 2 seconds, error rate < 1%

── STRESS TEST CONFIGURATION ────────────────────────────────────────
Thread Group (Ultimate Thread Group plugin):
  Start: 100 users
  Every 2 minutes, add 100 more users
  Until system shows errors > 5% or response time > 10s
  Goal: Find the breaking point

── SPIKE TEST CONFIGURATION ──────────────────────────────────────────
Concurrent Thread Groups:
  Phase 1: 100 users for 5 minutes (baseline)
  Phase 2: SPIKE to 5000 users instantly
  Phase 3: Hold 5000 users for 2 minutes
  Phase 4: Drop back to 100 users
  
Expected: System recovers within 30 seconds after spike

── SOAK TEST CONFIGURATION ───────────────────────────────────────────
Thread Group:
  Number of Threads: 500
  Ramp-Up Period: 120 seconds
  Duration: 86400 seconds      (24 hours)
  
Monitor: Memory usage, GC frequency, connection pool size, error rate
Alert if: Response time increases by >20% from baseline during the test
*/

// JMX file snippet (JMeter Test Plan XML):
/*
<ThreadGroup guiclass="ThreadGroupGui" testname="Load Test">
    <intProp name="ThreadGroup.num_threads">500</intProp>
    <intProp name="ThreadGroup.ramp_time">60</intProp>
    <boolProp name="ThreadGroup.scheduler">true</boolProp>
    <stringProp name="ThreadGroup.duration">1800</stringProp>
</ThreadGroup>
*/`,
    codeLanguage: 'java',
    realWorldExample: 'An e-commerce site runs: 1) Load test simulating 1000 users during normal hours — response times must be <2s. 2) Stress test for Black Friday peak (10,000 users) to find limits. 3) Spike test simulating a product going viral (+50,000 users in seconds). 4) Soak test for 48 hours to find memory leaks before a major release.',
    commonMistakes: [
      'Confusing stress testing (breaking point) with load testing (normal load)',
      'Not monitoring server-side metrics (CPU, memory, DB connections) during tests',
      'Running soak tests only for minutes instead of hours',
      'Not including ramp-up period in load tests — sudden spike on startup is unrealistic',
      'Ignoring soak test results — memory leaks only appear after sustained load',
    ],
    bestPractices: [
      'Always define acceptance criteria before running performance tests',
      'Monitor application AND infrastructure metrics (CPU, memory, GC, DB)',
      'Run performance tests in a production-like environment',
      'Establish a baseline before running stress/spike tests',
      'Use JMeter dashboards and listeners for real-time monitoring',
    ],
    interviewQuestions: [
      { q: 'What is the difference between load testing and stress testing?', a: 'Load testing validates system behavior under expected normal load (e.g., 500 concurrent users) to ensure performance meets SLAs. Stress testing pushes the system beyond normal capacity to find its breaking point and observe failure behavior.' },
      { q: 'What is soak testing and what does it detect?', a: 'Soak testing (endurance testing) runs the system under normal load for an extended period (hours/days). It detects memory leaks, connection pool exhaustion, file descriptor leaks, and gradual performance degradation that only appears with sustained usage over time.' },
      { q: 'What is spike testing?', a: 'Spike testing simulates sudden, extreme increases in load (like a flash sale or viral event). It verifies that the system can handle sudden traffic surges, auto-scale appropriately, and recover gracefully when the spike subsides.' },
    ],
    revisionSummary: 'Load=normal expected load. Stress=beyond capacity to find breaking point. Spike=sudden large burst. Soak=sustained load for hours to find memory leaks. Volume=large data. Scalability=scale up/down testing.',
    tags: ['performance-testing', 'load-testing', 'stress-testing', 'spike-testing', 'soak-testing', 'jmeter'],
  },

  {
    id: 'jmeter-architecture',
    moduleId: 'performance-testing',
    title: 'JMeter Architecture',
    priority: 'hot',
    estimatedMinutes: 45,
    overview: 'Apache JMeter is a pure Java desktop application for load testing. It simulates multiple users sending requests to a server and measures performance.',
    whyItMatters: 'JMeter is the most widely used open-source performance testing tool. Understanding its architecture and components is essential for SDET roles involving performance testing.',
    explanation: `**JMeter Components:**

**1. Test Plan**
The root element — contains all other elements. One JMeter test = one Test Plan (.jmx file).

**2. Thread Group**
Simulates virtual users. Configures:
- Number of threads (users)
- Ramp-up period (time to start all threads)
- Loop count or duration

**3. Samplers**
Make actual requests. Types:
- HTTP Request Sampler (most common)
- JDBC Request (database queries)
- FTP Request
- SMTP Sampler (email)
- Java Sampler (custom)

**4. Logic Controllers**
Control execution flow:
- Loop Controller — repeat requests
- If Controller — conditional logic
- Transaction Controller — group requests

**5. Listeners**
Collect and display results:
- View Results Tree (debug — shows individual responses)
- Summary Report (aggregate stats)
- Aggregate Report (percentiles)
- Response Time Graph (visual)
- Dashboard Report (HTML report)

**6. Configuration Elements**
- HTTP Header Manager
- HTTP Cookie Manager
- CSV Data Set Config
- User Defined Variables

**7. Timers**
Add think time between requests:
- Constant Timer (fixed delay)
- Gaussian Random Timer
- Uniform Random Timer

**8. Assertions**
Validate responses:
- Response Assertion (check status, body)
- JSON Assertion
- Duration Assertion (response time limit)

**9. Pre/Post Processors**
- BeanShell/JSR223 (scripting)
- Regular Expression Extractor
- JSON Extractor`,
    keyPoints: [
      'Thread Group = virtual users configuration (count, ramp-up, duration)',
      'Samplers = actual request makers (HTTP, JDBC, etc.)',
      'Listeners = result collectors (Summary Report, Aggregate Report)',
      'Configuration Elements = headers, cookies, variables, CSV data',
      'Assertions = response validators (status code, body content, time)',
      'Timers = think time simulation between requests',
      'JMeter runs in GUI mode for test creation, NON-GUI mode for actual testing',
    ],
    codeExample: `// ── JMETER KEY METRICS EXPLAINED ─────────────────────────────────

/*
AGGREGATE REPORT COLUMNS:
- Label: Sampler name
- # Samples: Total requests made
- Average: Mean response time (ms)
- Min: Minimum response time
- Max: Maximum response time
- Std. Dev.: Standard deviation (consistency indicator)
- Error %: Percentage of failed requests
- Throughput: Requests/second
- Received KB/sec: Network received
- Sent KB/sec: Network sent
- Avg. Bytes: Average response size

90th Percentile (90%): 90% of requests completed within this time
95th Percentile (95%): Most critical SLA metric
99th Percentile (99%): Worst-case performance

EXAMPLE ACCEPTABLE THRESHOLDS:
- Average response time: < 2000ms
- 95th percentile: < 3000ms
- Error rate: < 1%
- Throughput: > 50 req/sec

── JMETER NON-GUI MODE (for actual load tests) ────────────────────
jmeter -n -t TestPlan.jmx -l results.jtl -e -o ./DashboardReport

Parameters:
  -n: non-GUI mode
  -t: test plan file
  -l: log/results file (.jtl)
  -e: generate dashboard report
  -o: output directory for report

── CSV DATA SET CONFIG ───────────────────────────────────────────
// userdata.csv:
// username,password
// user1,pass1
// user2,pass2
// user3,pass3

// In JMeter, CSV Data Set Config reads this file
// [username] and [password] variables are populated
// Each thread (user) gets one row (or rows loop)

// HTTP Request sampler uses:
// Body: { "username": "[username]", "password": "[password]" }
*/

// ── JMETER + JAVA (running JMeter programmatically) ───────────────
// Add jmeter dependencies and run tests from Java:
StandardJMeterEngine jmeter = new StandardJMeterEngine();
JMeterUtils.loadJMeterProperties("/path/to/jmeter.properties");
HashTree testPlanTree = new HashTree();

TestPlan testPlan = new TestPlan("Load Test");
ThreadGroup threadGroup = new ThreadGroup();
threadGroup.setNumThreads(100);
threadGroup.setRampUp(30);
threadGroup.setScheduler(true);
threadGroup.setDuration(300);

HTTPSamplerProxy sampler = new HTTPSamplerProxy();
sampler.setDomain("api.example.com");
sampler.setPath("/users");
sampler.setMethod("GET");
sampler.setPort(443);
sampler.setProtocol("https");`,
    codeLanguage: 'java',
    realWorldExample: 'A payment gateway needs to handle 1000 transactions per second during peak hours. JMeter simulates 1000 virtual users making payment requests simultaneously. Listeners capture throughput (TPS), 95th percentile response time, and error rate. If error rate exceeds 0.1%, the test fails.',
    commonMistakes: [
      'Running performance tests in GUI mode — uses extra memory, affects results',
      'Not using timers — unrealistic because real users have think time between actions',
      'Not clearing previous results before running a new test',
      'Using "View Results Tree" listener in load tests — very resource intensive',
      'Not using CSV Data Set Config — hardcoding one username for all threads',
    ],
    bestPractices: [
      'Always run actual load tests in non-GUI mode (jmeter -n)',
      'Use CSV Data Set Config for parameterized test data',
      'Add think time (Constant/Gaussian Timer) to simulate real user behavior',
      'Monitor server resources (CPU, memory) during JMeter tests',
      'Use Transaction Controllers to group related requests for business-level metrics',
    ],
    interviewQuestions: [
      { q: 'What are Thread Groups in JMeter?', a: 'Thread Groups represent virtual users. They configure the number of threads (users), ramp-up period (time to gradually start all threads), and test duration or loop count. Each thread simulates one user independently executing the sampler requests.' },
      { q: 'What is the difference between Throughput and Response Time?', a: 'Throughput is the number of requests processed per second (req/sec or TPS) — measures server capacity. Response time is the time taken for the server to respond to a single request (ms) — measures user experience. High throughput with high response time indicates a system that processes many requests but slowly.' },
      { q: 'What is the difference between JMeter and LoadRunner?', a: 'JMeter is open-source, free, Java-based, widely used for web and API testing. LoadRunner is commercial (HP/Micro Focus), supports more protocols (SAP, Citrix, legacy systems), has more detailed analysis tools, and is preferred in large enterprises for complex performance testing scenarios.' },
    ],
    revisionSummary: 'JMeter: Test Plan→Thread Group(virtual users)→Samplers(HTTP requests)→Assertions(validation)→Listeners(results). Timers add think time. Always run in non-GUI mode. Key metrics: throughput, 95th %ile response time, error rate.',
    tags: ['jmeter', 'performance-testing', 'thread-group', 'sampler', 'listener', 'throughput'],
  },

  // ─── MODULE 6: GENERAL SDET ───────────────────────────────────────────────
  {
    id: 'sdlc-vs-stlc',
    moduleId: 'general-sdet',
    title: 'SDLC vs STLC',
    priority: 'normal',
    estimatedMinutes: 30,
    overview: 'SDLC (Software Development Life Cycle) defines the software development process, while STLC (Software Testing Life Cycle) defines the testing subprocess within SDLC.',
    whyItMatters: 'These are foundational concepts asked in entry and mid-level SDET interviews to gauge understanding of the overall software engineering process.',
    explanation: `**SDLC (Software Development Life Cycle):**
The complete process of planning, creating, testing, and deploying a software product.

Phases:
1. **Requirement Analysis** — Gather business requirements
2. **Planning** — Estimate costs, timelines, risks
3. **System Design** — Architecture, database, UI design
4. **Implementation (Coding)** — Developers write code
5. **Testing** — QA/SDET validates the software
6. **Deployment** — Release to production
7. **Maintenance** — Bug fixes, updates

SDLC Models: Waterfall, Agile (Scrum/Kanban), V-Model, Spiral, DevOps

**STLC (Software Testing Life Cycle):**
The subset of SDLC focused specifically on testing activities.

Phases:
1. **Requirement Analysis** — Understand what to test
2. **Test Planning** — Test strategy, resources, schedule
3. **Test Case Design** — Write test cases and test data
4. **Test Environment Setup** — Prepare test infrastructure
5. **Test Execution** — Run tests, log defects
6. **Test Closure** — Test summary report, lessons learned

**Key Difference:**
SDLC = full product lifecycle | STLC = testing subset of SDLC`,
    keyPoints: [
      'SDLC covers the entire software development process, STLC covers testing within it',
      'STLC starts with Requirement Analysis and ends with Test Closure',
      'In Agile, STLC happens within each sprint (2-week cycle)',
      'SDET participates in both SDLC (design reviews) and STLC (test execution)',
      'V-Model is SDLC model where each dev phase maps to a test phase',
    ],
    codeExample: `/*
SDLC → STLC PARALLEL PHASES (V-Model):

Development Phase          Testing Phase
─────────────────────────────────────────
Requirement Analysis   ←→  Acceptance Testing
System Design          ←→  System Testing  
Architecture Design    ←→  Integration Testing
Module Design          ←→  Unit Testing
Coding                 ←→  Unit Testing (TDD)

AGILE SPRINT CYCLE (2 weeks):
Day 1: Sprint Planning → SDET: test planning
Day 2-4: Development → SDET: write test cases
Day 5-8: Dev continues → SDET: automate tests
Day 9-10: Feature freeze → SDET: regression testing
Day 11: Bug fixes → SDET: retest/regression
Day 12: Sprint Review + Demo → SDET: sign-off
Day 13-14: Sprint Retrospective → SDET: test report
*/`,
    codeLanguage: 'java',
    realWorldExample: 'In an Agile project, during Sprint 5, the SDLC includes design review (Monday), coding (Tuesday-Thursday), and deployment to staging (Friday). The STLC runs in parallel: test case design (Monday), test automation (Tuesday-Thursday), regression execution (Friday). STLC is the testing slice of the SDLC.',
    commonMistakes: [
      'Thinking STLC is a completely separate process from SDLC',
      'Forgetting that STLC has its own Requirement Analysis phase (understanding what to test)',
      'Not knowing the phases — interviewers often ask to list all phases in order',
    ],
    bestPractices: [
      'In Agile, involve QA/SDET from Day 1 of sprint (shift-left testing)',
      'Use BDD (Behavior Driven Development) to align SDLC and STLC requirements',
      'Automate regression suite so STLC test execution is fast in every sprint',
    ],
    interviewQuestions: [
      { q: 'What is the difference between SDLC and STLC?', a: 'SDLC (Software Development Life Cycle) covers the complete software creation process: requirements, design, coding, testing, deployment, maintenance. STLC (Software Testing Life Cycle) is a subset of SDLC focused on testing activities: test planning, test case design, environment setup, test execution, and test closure.' },
      { q: 'What are the phases of STLC?', a: '1. Requirement Analysis 2. Test Planning 3. Test Case Design/Development 4. Test Environment Setup 5. Test Execution 6. Test Closure' },
    ],
    revisionSummary: 'SDLC = full dev lifecycle. STLC = testing subset of SDLC. STLC phases: Requirements→Planning→Test Design→Environment Setup→Execution→Closure. In Agile, both happen within each sprint.',
    tags: ['sdlc', 'stlc', 'software-lifecycle', 'testing-lifecycle', 'agile'],
  },

  {
    id: 'cicd-basics',
    moduleId: 'general-sdet',
    title: 'CI/CD Basics',
    priority: 'normal',
    estimatedMinutes: 35,
    overview: 'CI (Continuous Integration) is the practice of frequently merging code changes and running automated tests. CD (Continuous Delivery/Deployment) extends this to automating the release process.',
    whyItMatters: 'Modern SDETs are expected to integrate their automation tests into CI/CD pipelines. Jenkins is the most common CI tool used with Selenium in enterprises.',
    explanation: `**Continuous Integration (CI):**
- Developers merge code changes frequently (multiple times per day)
- Every merge triggers automated build + test execution
- Quick feedback on code quality
- Tools: Jenkins, GitHub Actions, GitLab CI, CircleCI, Azure DevOps

**Continuous Delivery (CD):**
- Extends CI by automating the deployment to staging
- Every successful CI build is ready to deploy to production
- Requires manual approval for production deployment

**Continuous Deployment:**
- Fully automated — every successful build deploys to production automatically
- No manual gates (requires very mature test automation)

**CI/CD Pipeline Stages for Selenium:**
1. Code commit → Git trigger
2. Maven Build (mvn compile)
3. Unit Tests (JUnit/TestNG)
4. Integration Tests
5. Selenium/API Tests (Selenium Grid)
6. Test Report Generation (ExtentReports/Allure)
7. Deploy to Staging
8. Smoke Tests on Staging
9. Manual Approval / Auto-Deploy to Production

**Jenkins + Maven + Selenium Setup:**
- Jenkins pulls code from Git
- Runs: mvn test -Dgroups=regression -Dbrowser=chrome
- Publishes HTML test reports
- Sends email on failure`,
    keyPoints: [
      'CI = frequent code integration + automated test execution',
      'CD = automated delivery/deployment after CI succeeds',
      'Jenkins is the most common CI tool in Java SDET projects',
      'Maven is used to build projects and run tests: mvn test',
      'Selenium tests run in headless mode on CI servers (no display)',
      'Git webhooks trigger Jenkins builds on code push',
    ],
    codeExample: `// ── JENKINS PIPELINE (Jenkinsfile) ───────────────────────────────
pipeline {
    agent any
    
    environment {
        MAVEN_HOME = '/usr/share/maven'
        BROWSER    = 'chrome'
        ENV        = 'staging'
    }
    
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/company/selenium-framework.git'
            }
        }
        
        stage('Build') {
            steps {
                sh 'mvn clean compile -q'
            }
        }
        
        stage('Unit Tests') {
            steps {
                sh 'mvn test -Dgroups=unit -q'
            }
        }
        
        stage('API Tests') {
            steps {
                sh 'mvn test -Dgroups=api -Denv=[ENV]'
            }
        }
        
        stage('Selenium Tests') {
            steps {
                sh '''
                    mvn test \\
                        -Dgroups=regression \\
                        -Dbrowser=[BROWSER] \\
                        -Denv=[ENV] \\
                        -Dheadless=true \\
                        -Dsurefire.parallel.methods=true \\
                        -Dthreads=4
                '''
            }
            post {
                always {
                    publishHTML([
                        allowMissing: false,
                        reportDir: 'target/extent-reports',
                        reportFiles: 'ExtentReport.html',
                        reportName: 'Selenium Test Report'
                    ])
                }
            }
        }
        
        stage('Deploy to Staging') {
            when {
                expression { currentBuild.result == null || 
                             currentBuild.result == 'SUCCESS' }
            }
            steps {
                sh './deploy.sh staging'
            }
        }
    }
    
    post {
        failure {
            emailext(
                subject: "Build FAILED: [env.JOB_NAME] #[env.BUILD_NUMBER]",
                body: "Check console: [env.BUILD_URL]",
                to: 'sdet-team@company.com'
            )
        }
    }
}`,
    codeLanguage: 'java',
    realWorldExample: 'At a fintech company, every Git push to the "develop" branch triggers a Jenkins pipeline. It builds the Maven project, runs 200 API tests with Rest Assured, then runs 50 Selenium regression tests on Chrome (headless) via Selenium Grid. The entire pipeline takes 15 minutes. If all pass, the app is deployed to staging automatically.',
    commonMistakes: [
      'Running Selenium tests without headless mode on CI servers (no display available)',
      'Not setting up Selenium Grid for CI — running all tests sequentially is too slow',
      'Hardcoding environment URLs in tests instead of passing via -D parameters',
      'Not publishing test reports in Jenkins (developers cannot see what failed)',
    ],
    bestPractices: [
      'Always run Selenium in headless mode on CI: --headless=new',
      'Use TestNG parallel execution to speed up CI runs',
      'Parameterize environment and browser via Maven -D flags',
      'Publish ExtentReports or Allure reports in Jenkins for visibility',
      'Fail fast — run smoke tests first, then full regression',
    ],
    interviewQuestions: [
      { q: 'How do you integrate Selenium tests with Jenkins?', a: 'Create a Jenkins pipeline (Jenkinsfile) that: 1) Pulls code from Git, 2) Runs mvn test with headless browser, 3) Publishes HTML test reports using Jenkins HTML Publisher plugin, 4) Sends email notification on failure. The pipeline is triggered by a Git webhook on every commit.' },
      { q: 'What is the difference between CI and CD?', a: 'CI (Continuous Integration) is about frequently merging code and automatically building and testing it. CD (Continuous Delivery) extends CI by also automating the delivery to staging environments, with optional manual approval for production. Continuous Deployment goes further by automatically deploying to production after all tests pass.' },
    ],
    revisionSummary: 'CI = frequent merge + automated build+test. CD = automated delivery to staging. Jenkins pipeline: Git pull → Build → Tests → Report → Deploy. Selenium on CI must use headless mode. Maven runs tests with mvn test.',
    tags: ['cicd', 'jenkins', 'maven', 'continuous-integration', 'devops', 'automation'],
  },
];

export function getTopicContent(topicId: string): TopicContent | undefined {
  return topicContents.find(t => t.id === topicId);
}

export function getModuleTopics(moduleId: string): TopicContent[] {
  return topicContents.filter(t => t.moduleId === moduleId);
}
