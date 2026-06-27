export type Priority = 'critical' | 'important' | 'good-to-know';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Topic {
  id: string;
  title: string;
  priority: 'hot' | 'warm' | 'normal';
  estimatedMinutes: number;
  description: string;
}

export interface TopicGroup {
  title: string;
  topics: Topic[];
}

export interface Module {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  priority: Priority;
  difficulty: Difficulty;
  estimatedHours: number;
  description: string;
  topicGroups: TopicGroup[];
  color: string; // tailwind gradient class
  icon: string; // emoji
}

export const modules: Module[] = [
  // ─────────────────────────────────────────────────────────────────────────
  // MODULE 1 – Selenium WebDriver
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'selenium-webdriver',
    number: 1,
    title: 'Selenium WebDriver',
    subtitle: 'End-to-End Browser Automation',
    priority: 'critical',
    difficulty: 'hard',
    estimatedHours: 12,
    description:
      'Master Selenium WebDriver from architecture to advanced interactions. ' +
      'Covers the full automation stack used in Cognizant SDET roles: ' +
      'locators, waits, TestNG, Apache POI data-driven testing, and advanced ' +
      'browser interactions with ExtentReports and JavaScriptExecutor.',
    color: 'from-blue-500 to-cyan-500',
    icon: '🌐',
    topicGroups: [
      {
        title: 'Core Concepts',
        topics: [
          {
            id: 'webdriver-architecture',
            title: 'WebDriver Architecture',
            priority: 'hot',
            estimatedMinutes: 60,
            description:
              'Understand the W3C WebDriver protocol and the client–server ' +
              'architecture of Selenium 4. Learn how the Java/Python client ' +
              'communicates via JSON Wire Protocol (legacy) or W3C HTTP ' +
              'endpoints with the browser driver (ChromeDriver, GeckoDriver). ' +
              'Key concepts: RemoteWebDriver, LocalFileDetector, WebDriver ' +
              'Manager, and the role of browser drivers as HTTP servers.',
          },
          {
            id: 'page-object-model',
            title: 'Page Object Model (POM)',
            priority: 'hot',
            estimatedMinutes: 60,
            description:
              'Design pattern that encapsulates web page elements and actions ' +
              'in dedicated classes, separating test logic from UI details. ' +
              'Covers: @FindBy annotations with PageFactory, lazy initialisation ' +
              'via initElements(), BasePage abstraction, and PageComponent ' +
              'pattern for reusable components like headers/footers. ' +
              'Understand how POM improves maintainability and reduces ' +
              'duplication in large test suites.',
          },
          {
            id: 'selenium-grid',
            title: 'Selenium Grid (Hub & Node)',
            priority: 'warm',
            estimatedMinutes: 45,
            description:
              'Distribute test execution across multiple machines and browsers ' +
              'using Selenium Grid 4 (fully revised with built-in support for ' +
              'Distributed, Standalone, and Node modes). Topics include: ' +
              'registering nodes, DesiredCapabilities / Options, routing ' +
              'requests, Docker-Selenium for containerised grids, and ' +
              'integrating with CI pipelines.',
          },
          {
            id: 'implicit-explicit-fluent-waits',
            title: 'Implicit, Explicit & Fluent Waits',
            priority: 'hot',
            estimatedMinutes: 60,
            description:
              'Eliminate flaky tests by mastering WebDriver wait strategies. ' +
              'Implicit wait: global polling timeout applied to every ' +
              'findElement call. Explicit wait (WebDriverWait + ' +
              'ExpectedConditions): condition-based waiting for specific ' +
              'elements or states. Fluent wait: customise polling interval, ' +
              'ignored exceptions, and timeout for fine-grained control. ' +
              'Understand why mixing implicit and explicit waits causes issues.',
          },
          {
            id: 'locator-strategies',
            title: 'Locator Strategies',
            priority: 'hot',
            estimatedMinutes: 60,
            description:
              'Select and use the right locator for robust element identification: ' +
              'ID, Name, ClassName, TagName, LinkText, PartialLinkText, CSS ' +
              'Selector, and XPath. Covers priority order for maintainability, ' +
              'unique vs. fragile locators, and By.* factory methods. ' +
              'Also includes Selenium 4 relative locators (above, below, ' +
              'toLeftOf, toRightOf, near) for positional element selection.',
          },
        ],
      },
      {
        title: 'Dynamic XPath',
        topics: [
          {
            id: 'dynamic-xpath-patterns',
            title: 'Dynamic XPath Patterns',
            priority: 'hot',
            estimatedMinutes: 60,
            description:
              'Write XPath expressions that handle dynamically generated ' +
              'element attributes (auto-incremented IDs, session tokens, ' +
              'timestamp-based classes). Techniques: attribute wildcards ' +
              '(@*), multiple attribute conditions (and/or), normalize-space() ' +
              'for whitespace handling, and XPath variables via string ' +
              'concatenation in Java/Python. Essential for enterprise AUT ' +
              'where static locators frequently break.',
          },
          {
            id: 'xpath-axes',
            title: 'XPath Axes',
            priority: 'warm',
            estimatedMinutes: 45,
            description:
              'Navigate the DOM tree using XPath axes: parent, child, ' +
              'ancestor, descendant, following-sibling, preceding-sibling, ' +
              'following, preceding, and self. Understand how to build ' +
              'robust sibling/parent-traversal expressions for tables, ' +
              'lists, and dynamic UI components where direct locators are ' +
              'unavailable.',
          },
          {
            id: 'absolute-vs-relative-xpath',
            title: 'Absolute vs Relative XPath',
            priority: 'hot',
            estimatedMinutes: 45,
            description:
              'Differentiate between absolute XPath (/html/body/div[1]/...) ' +
              'and relative XPath (//tag[@attr="value"]). Understand why ' +
              'absolute paths break with minor DOM changes and when relative ' +
              'paths using anchor elements provide resilience. Best practices ' +
              'for choosing starting nodes and chaining conditions.',
          },
          {
            id: 'contains-starts-with-text',
            title: 'contains(), starts-with() & text()',
            priority: 'hot',
            estimatedMinutes: 45,
            description:
              'Partial attribute matching with contains(@attr, "value") for ' +
              'dynamically appended class names or IDs. starts-with(@attr, ' +
              '"prefix") for fixed-prefix attributes. text() node function for ' +
              'matching visible text content, and normalize-space(text()) ' +
              'to ignore leading/trailing whitespace. Combine these to build ' +
              'resilient, readable locators.',
          },
          {
            id: 'css-vs-xpath',
            title: 'CSS Selectors vs XPath',
            priority: 'warm',
            estimatedMinutes: 30,
            description:
              'Compare CSS selectors and XPath across dimensions: performance ' +
              '(CSS is generally faster in modern browsers), readability, ' +
              'capability (XPath can traverse upward; CSS cannot), and ' +
              'browser support. When to prefer CSS (simple attribute/class ' +
              'selection) vs XPath (complex traversal, text-based matching). ' +
              'Covers CSS pseudo-classes (:nth-child, :first-of-type) ' +
              'and attribute selectors ([attr^="value"]).',
          },
        ],
      },
      {
        title: 'Exception Handling',
        topics: [
          {
            id: 'stale-element-reference',
            title: 'StaleElementReferenceException',
            priority: 'hot',
            estimatedMinutes: 45,
            description:
              'Occurs when a WebElement reference becomes outdated after DOM ' +
              'refresh, navigation, or dynamic content updates. Resolution ' +
              'strategies: re-locate the element inside a retry loop, use ' +
              'explicit waits with staleness conditions ' +
              '(ExpectedConditions.stalenessOf), avoid storing references ' +
              'across navigation events, and apply the POM pattern to ' +
              're-initialise elements on demand.',
          },
          {
            id: 'no-such-element',
            title: 'NoSuchElementException',
            priority: 'hot',
            estimatedMinutes: 45,
            description:
              'Thrown when findElement() cannot locate the target in the current ' +
              'DOM. Diagnose causes: wrong locator, element inside iframe ' +
              'requiring context switch, element not yet loaded (missing wait), ' +
              'or element conditionally rendered. Covers try-catch with ' +
              'findElements() size check, explicit waits, and frame-switching ' +
              'patterns.',
          },
          {
            id: 'element-not-interactable',
            title: 'ElementNotInteractableException',
            priority: 'warm',
            estimatedMinutes: 30,
            description:
              'Element exists in DOM but cannot receive user interactions ' +
              '(hidden, disabled, or obscured). Resolution: wait for ' +
              'visibilityOfElementLocated, scroll element into view using ' +
              'JavascriptExecutor.scrollIntoView(), use Actions.moveToElement(), ' +
              'or use JS click as a workaround when a legitimate overlay ' +
              'blocks the element.',
          },
          {
            id: 'element-click-intercepted',
            title: 'ElementClickInterceptedException',
            priority: 'warm',
            estimatedMinutes: 30,
            description:
              'Another element (modal, cookie banner, toast notification) ' +
              'receives the click instead of the target. Strategies: dismiss ' +
              'the overlapping element first, wait for it to disappear using ' +
              'invisibilityOf(), scroll to bring target into viewport, or ' +
              'use JavascriptExecutor click as a last resort.',
          },
          {
            id: 'timeout-exception',
            title: 'TimeoutException',
            priority: 'warm',
            estimatedMinutes: 30,
            description:
              'WebDriverWait condition not met within the specified timeout. ' +
              'Investigate: slow network/AUT performance, wrong expected ' +
              'condition, or element in a different frame. Strategies: tune ' +
              'timeout values per environment, use environment-specific ' +
              'configuration, and log wait conditions for faster debugging.',
          },
          {
            id: 'webdriver-exception',
            title: 'WebDriverException (General)',
            priority: 'normal',
            estimatedMinutes: 20,
            description:
              'Root exception for all WebDriver failures. Common causes: ' +
              'browser/driver version mismatch (fix with WebDriverManager), ' +
              'session not created (browser crashed or not found), and ' +
              'connection refused (Grid node unavailable). Covers exception ' +
              'hierarchy and best practices for meaningful error messages ' +
              'in custom exceptions.',
          },
        ],
      },
      {
        title: 'TestNG',
        topics: [
          {
            id: 'testng-annotations',
            title: 'TestNG Annotations',
            priority: 'hot',
            estimatedMinutes: 60,
            description:
              'Full lifecycle annotation coverage: @BeforeSuite, @AfterSuite, ' +
              '@BeforeTest, @AfterTest, @BeforeClass, @AfterClass, ' +
              '@BeforeMethod, @AfterMethod, @Test. Understand execution ' +
              'order, scope of each annotation, and how to use them for ' +
              'driver initialisation/teardown, authentication setup, and ' +
              'test data preparation. Also covers @Test attributes: ' +
              'enabled, description, timeOut, expectedExceptions.',
          },
          {
            id: 'dataprovider',
            title: '@DataProvider',
            priority: 'hot',
            estimatedMinutes: 60,
            description:
              'Parameterise tests without XML using @DataProvider methods that ' +
              'return Object[][]. Covers: linking with @Test(dataProvider="name"), ' +
              'cross-class providers (dataProviderClass attribute), parallel ' +
              'DataProvider execution, combining with Apache POI for ' +
              'Excel-driven data, and using ITestContext to access test ' +
              'suite parameters inside a DataProvider.',
          },
          {
            id: 'groups-and-priority',
            title: 'Groups & Priority',
            priority: 'warm',
            estimatedMinutes: 30,
            description:
              'Organise and order test execution using @Test(groups={"smoke"}) ' +
              'and XML <groups> include/exclude. Priority attribute ' +
              '(@Test(priority=1)) controls execution order within a class ' +
              '(lower number = higher priority). Combine with dependsOnMethods ' +
              'and dependsOnGroups for chained test workflows.',
          },
          {
            id: 'parallel-execution',
            title: 'Parallel Execution',
            priority: 'hot',
            estimatedMinutes: 60,
            description:
              'Configure parallel test runs in testng.xml using ' +
              'parallel="methods|classes|tests|instances" and thread-count. ' +
              'Implement ThreadLocal<WebDriver> to ensure thread-safe driver ' +
              'instances. Covers: driver factory pattern, parallel DataProvider, ' +
              'and debugging thread-safety issues (race conditions, shared ' +
              'state). Integration with Selenium Grid for distributed parallel runs.',
          },
          {
            id: 'testng-listeners-reports',
            title: 'TestNG Listeners & Reports',
            priority: 'warm',
            estimatedMinutes: 45,
            description:
              'Hook into TestNG lifecycle events using built-in listeners: ' +
              'ITestListener (onTestStart, onTestFailure, onTestSuccess), ' +
              'ISuiteListener, IInvokedMethodListener, and IRetryAnalyzer for ' +
              'automatic test retries. Generate built-in HTML/XML reports and ' +
              'integrate ExtentReports or Allure for rich dashboards.',
          },
          {
            id: 'itestlistener',
            title: 'ITestListener Deep Dive',
            priority: 'warm',
            estimatedMinutes: 45,
            description:
              'Implement ITestListener to capture screenshots on failure, log ' +
              'test names to reporting tools, and emit Slack/email alerts. ' +
              'Register listeners via testng.xml <listeners> or ' +
              '@Listeners annotation on test classes. Understand the difference ' +
              'between ITestListener and IInvokedMethodListener for pre/post ' +
              'method interception.',
          },
        ],
      },
      {
        title: 'Apache POI (Data-Driven)',
        topics: [
          {
            id: 'read-write-excel',
            title: 'Read & Write Excel with Apache POI',
            priority: 'hot',
            estimatedMinutes: 60,
            description:
              'Use Apache POI to read (.xls/.xlsx) and write Excel files in ' +
              'Java. Core classes: WorkbookFactory, HSSFWorkbook (XLS), ' +
              'XSSFWorkbook (XLSX), Sheet, Row, Cell. Covers: iterating ' +
              'rows/cells, reading different cell types (STRING, NUMERIC, ' +
              'BOOLEAN, FORMULA), writing data back, and closing streams ' +
              'correctly to avoid file corruption.',
          },
          {
            id: 'data-driven-testing-poi',
            title: 'Data-Driven Testing with POI',
            priority: 'hot',
            estimatedMinutes: 60,
            description:
              'Combine Apache POI with TestNG @DataProvider to run the same ' +
              'test with multiple data sets from an Excel sheet. Pattern: ' +
              'ExcelUtils class reads the sheet into Object[][], DataProvider ' +
              'returns it, @Test method receives parameters. Covers sheet ' +
              'selection by name/index, column header mapping, and skipping ' +
              'header rows.',
          },
          {
            id: 'hssf-vs-xssf',
            title: 'HSSF vs XSSF vs SXSSF',
            priority: 'warm',
            estimatedMinutes: 30,
            description:
              'HSSF: legacy .xls format (max 65,536 rows). XSSF: modern .xlsx ' +
              'format with higher row limits. SXSSF: streaming variant of XSSF ' +
              'for writing large datasets without OutOfMemoryError. Understand ' +
              'when to use each, memory implications, and WorkbookFactory for ' +
              'format-agnostic reading.',
          },
          {
            id: 'multiple-sheets',
            title: 'Working with Multiple Sheets',
            priority: 'warm',
            estimatedMinutes: 30,
            description:
              'Access sheets by index (workbook.getSheetAt(0)) or name ' +
              '(workbook.getSheet("Login")). Create, rename, and delete ' +
              'sheets programmatically. Useful for test data organisation: ' +
              'separate sheets per feature area, environment configs, and ' +
              'expected results. Covers cross-sheet reference patterns in ' +
              'data-driven frameworks.',
          },
        ],
      },
      {
        title: 'Advanced Interactions',
        topics: [
          {
            id: 'dropdowns-iframes-alerts-windows',
            title: 'Dropdowns, iFrames, Alerts & Windows',
            priority: 'hot',
            estimatedMinutes: 60,
            description:
              'Dropdowns: Select class for <select> elements (selectByValue, ' +
              'selectByVisibleText, selectByIndex); custom dropdown handling. ' +
              'iFrames: driver.switchTo().frame(index/name/WebElement) and ' +
              'switchTo().defaultContent(). Alerts: driver.switchTo().alert() ' +
              'with accept(), dismiss(), getText(), sendKeys() for prompt alerts. ' +
              'Multiple windows: getWindowHandles(), switchTo().window(handle).',
          },
          {
            id: 'file-upload-download',
            title: 'File Upload & Download',
            priority: 'warm',
            estimatedMinutes: 45,
            description:
              'File upload via sendKeys() with absolute file path on ' +
              '<input type="file"> elements. Robot class for OS-level file ' +
              'dialog interaction. Download handling: configure Chrome/Firefox ' +
              'preferences to auto-download to a known directory, then verify ' +
              'file existence. Covers AutoIT for Windows dialog automation ' +
              'and Sikuli for image-based interaction.',
          },
          {
            id: 'actions-class',
            title: 'Actions Class',
            priority: 'hot',
            estimatedMinutes: 45,
            description:
              'Simulate complex user gestures using the Actions class: ' +
              'hover (moveToElement), drag-and-drop, double-click, right-click ' +
              '(contextClick), click-and-hold, key combinations ' +
              '(keyDown/keyUp), and chaining multiple actions with build().perform(). ' +
              'Understand when Actions is needed vs. direct WebElement methods.',
          },
          {
            id: 'screenshots',
            title: 'Screenshots & Visual Validation',
            priority: 'warm',
            estimatedMinutes: 30,
            description:
              'Capture full-page and element-level screenshots using ' +
              'TakesScreenshot interface and getScreenshotAs(OutputType.FILE). ' +
              'Embed screenshots in ExtentReports/Allure on test failure. ' +
              'Intro to visual regression testing with Ashot library for ' +
              'full-page screenshots and pixel-level comparison. ' +
              'Screenshot naming conventions for CI artefacts.',
          },
          {
            id: 'extent-reports',
            title: 'ExtentReports Integration',
            priority: 'warm',
            estimatedMinutes: 45,
            description:
              'Generate rich HTML test reports using ExtentReports 5. Core ' +
              'components: ExtentSparkReporter (HTML), ExtentReports (manager), ' +
              'ExtentTest (per-test logger). Log steps (info, pass, fail, skip), ' +
              'attach screenshots, and add system/environment info. Thread-safe ' +
              'implementation using ThreadLocal<ExtentTest> for parallel runs.',
          },
          {
            id: 'javascript-executor',
            title: 'JavascriptExecutor',
            priority: 'warm',
            estimatedMinutes: 45,
            description:
              'Execute JavaScript directly in the browser context using ' +
              'JavascriptExecutor. Key use cases: scrolling (scrollIntoView, ' +
              'scrollBy), clicking elements blocked by overlays, setting ' +
              'element values directly, reading element properties not exposed ' +
              'via WebDriver API, and waiting for JavaScript conditions ' +
              '(document.readyState === "complete").',
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // MODULE 2 – REST Assured
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'rest-assured',
    number: 2,
    title: 'REST Assured',
    subtitle: 'API Test Automation',
    priority: 'critical',
    difficulty: 'medium',
    estimatedHours: 8,
    description:
      'Learn API test automation with REST Assured, the de facto Java library ' +
      'for testing RESTful services. Covers the BDD-style given-when-then DSL, ' +
      'request building, JSON/XML response validation, Hamcrest matchers, ' +
      'JSON Schema validation, authentication mechanisms, and HTTP fundamentals ' +
      'essential for Cognizant SDET API testing interviews.',
    color: 'from-green-500 to-emerald-500',
    icon: '🔌',
    topicGroups: [
      {
        title: 'REST Assured Core',
        topics: [
          {
            id: 'given-when-then',
            title: 'given() / when() / then() DSL',
            priority: 'hot',
            estimatedMinutes: 60,
            description:
              'REST Assured\'s BDD-style fluent API: given() sets up request ' +
              'specification (headers, body, auth, params), when() specifies ' +
              'the HTTP method and endpoint (get, post, put, patch, delete), ' +
              'then() validates the response (statusCode, body, headers). ' +
              'Covers method chaining, static imports for readability, ' +
              'and extracting the Response object for further assertions.',
          },
          {
            id: 'status-code-body-validation',
            title: 'Status Code & Body Validation',
            priority: 'hot',
            estimatedMinutes: 60,
            description:
              'Assert HTTP status codes with statusCode(200) and status line. ' +
              'Validate response body fields with body("key", equalTo("value")), ' +
              'body("array.size()", is(3)), and nested path assertions. ' +
              'Covers contentType() assertion, header() validation, and ' +
              'response time assertion with time(lessThan(2000L)). ' +
              'Introduction to SoftAssertions for non-failing partial validation.',
          },
          {
            id: 'jsonpath-extraction',
            title: 'JsonPath Extraction',
            priority: 'hot',
            estimatedMinutes: 60,
            description:
              'Extract values from JSON responses using JsonPath expressions: ' +
              'response.jsonPath().get("user.id"), getString(), getInt(), ' +
              'getList(). Path syntax: dot notation, bracket notation, ' +
              'array indexing ([0]), wildcard (*.name), filter expressions ' +
              '([?(@.age > 18)]). Store extracted values for chained requests ' +
              '(e.g., create-then-retrieve test flows).',
          },
          {
            id: 'post-request-body',
            title: 'POST Request with Body',
            priority: 'hot',
            estimatedMinutes: 60,
            description:
              'Send POST/PUT/PATCH requests with JSON bodies using: ' +
              'body(String json), body(Map<> map), body(POJO object) with ' +
              'Jackson/Gson serialisation. Configure contentType(ContentType.JSON). ' +
              'Covers serialisation/deserialisation with ObjectMapper, ' +
              'sending form data (formParam), and multipart bodies.',
          },
          {
            id: 'authentication-basic-bearer-oauth',
            title: 'Authentication: Basic, Bearer & OAuth2',
            priority: 'hot',
            estimatedMinutes: 60,
            description:
              'Implement authentication in REST Assured: Basic auth with ' +
              'auth().basic("user","pass"), preemptive basic auth, digest auth. ' +
              'Bearer token: header("Authorization", "Bearer " + token). ' +
              'OAuth2: auth().oauth2(accessToken). Covers extracting tokens ' +
              'from login responses and using RequestSpecification to share ' +
              'auth across tests.',
          },
        ],
      },
      {
        title: 'Request Handling',
        topics: [
          {
            id: 'query-path-params',
            title: 'Query & Path Parameters',
            priority: 'hot',
            estimatedMinutes: 45,
            description:
              'Add query parameters: queryParam("key", "value") or queryParams(map) ' +
              'for URL strings like ?page=1&size=10. Path parameters: ' +
              'pathParam("id", 42) with placeholder {id} in the URL template. ' +
              'Covers URL encoding, multi-value params, and building dynamic ' +
              'endpoint URLs for CRUD operations on different resources.',
          },
          {
            id: 'request-headers',
            title: 'Request Headers',
            priority: 'warm',
            estimatedMinutes: 30,
            description:
              'Set individual headers: header("X-API-Key", "abc123") or ' +
              'headers(new Headers(...)). Common headers: Content-Type, Accept, ' +
              'Authorization, X-Request-ID. Validate response headers: ' +
              'then().header("Content-Type", containsString("application/json")). ' +
              'Covers custom headers for API versioning (Accept: ' +
              'application/vnd.company.v2+json).',
          },
          {
            id: 'multipart-file-upload',
            title: 'Multipart File Upload',
            priority: 'warm',
            estimatedMinutes: 30,
            description:
              'Upload files via API using multiPart("file", new File("path")) ' +
              'with ContentType.MULTIPART. Combine file upload with form fields ' +
              'using additional multiPart() calls. Covers testing file upload ' +
              'endpoints, validating upload response (file URL, ID), and ' +
              'handling large file scenarios.',
          },
          {
            id: 'request-specification',
            title: 'RequestSpecification (Reusable Setup)',
            priority: 'warm',
            estimatedMinutes: 45,
            description:
              'Avoid repetition with RequestSpecification: build a shared spec ' +
              'using RequestSpecBuilder with base URI, port, base path, headers, ' +
              'and auth, then apply it with given().spec(requestSpec). ' +
              'Similarly, ResponseSpecification validates common assertions. ' +
              'Combine both for a clean, DRY test framework. Covers ' +
              'RestAssured.requestSpecification for global defaults.',
          },
          {
            id: 'base-uri-base-path',
            title: 'Base URI & Base Path Configuration',
            priority: 'warm',
            estimatedMinutes: 30,
            description:
              'Configure global defaults with RestAssured.baseURI = ' +
              '"https://api.example.com" and RestAssured.basePath = "/v1". ' +
              'Use these to avoid repeating the host in every test. ' +
              'Environment-driven configuration: read base URI from property ' +
              'files or environment variables for dev/staging/prod. Covers ' +
              'port configuration and proxy settings.',
          },
        ],
      },
      {
        title: 'Response Validation',
        topics: [
          {
            id: 'hamcrest-matchers',
            title: 'Hamcrest Matchers',
            priority: 'hot',
            estimatedMinutes: 60,
            description:
              'Use Hamcrest matchers for expressive assertions in REST Assured: ' +
              'equalTo(), not(), containsString(), startsWith(), hasSize(), ' +
              'hasItem(), hasItems(), everyItem(), greaterThan(), lessThan(), ' +
              'notNullValue(), nullValue(), isOneOf(). Combine matchers with ' +
              'allOf() and anyOf() for complex conditions. Understand Matcher<T> ' +
              'generic typing for type safety.',
          },
          {
            id: 'schema-validation',
            title: 'JSON Schema Validation',
            priority: 'warm',
            estimatedMinutes: 45,
            description:
              'Validate API response structure against a JSON Schema using ' +
              'matchesJsonSchemaInClasspath("schema.json") from the ' +
              'rest-assured json-schema-validator module. Schema covers: ' +
              'type, required fields, format, minLength/maxLength, enum, ' +
              'and nested object/array definitions. Covers contract testing ' +
              'fundamentals and integrating schema validation in CI.',
          },
          {
            id: 'nested-json-assertion',
            title: 'Nested JSON Assertions',
            priority: 'hot',
            estimatedMinutes: 45,
            description:
              'Assert deeply nested JSON structures using dot-notation paths: ' +
              'body("data.user.address.city", equalTo("Mumbai")). Array ' +
              'element assertions: body("items[0].price", greaterThan(0)). ' +
              'Collect all values: body("users.name", hasItems("Alice","Bob")). ' +
              'Filter arrays: body("orders.findAll{it.status==\'active\'}.id", ' +
              'hasSize(2)) using GPath expressions.',
          },
          {
            id: 'xmlpath-for-xml',
            title: 'XmlPath for XML Responses',
            priority: 'normal',
            estimatedMinutes: 20,
            description:
              'Parse and validate XML API responses using XmlPath: ' +
              'response.xmlPath().getString("root.child.text()"). ' +
              'Covers namespace handling, XPath vs GPath in XML context, ' +
              'and attribute access (root.element.@attribute). Useful for ' +
              'legacy SOAP-over-HTTP endpoints and hybrid REST/XML APIs.',
          },
        ],
      },
      {
        title: 'HTTP Fundamentals',
        topics: [
          {
            id: 'http-methods',
            title: 'HTTP Methods',
            priority: 'hot',
            estimatedMinutes: 60,
            description:
              'Deep understanding of HTTP methods for REST APIs: GET (retrieve, ' +
              'safe, idempotent), POST (create, not idempotent), PUT (full ' +
              'update/replace, idempotent), PATCH (partial update), DELETE ' +
              '(remove, idempotent), HEAD (GET without body for metadata), ' +
              'OPTIONS (CORS preflight, supported methods). Understand safe ' +
              'vs unsafe, idempotent vs non-idempotent classifications.',
          },
          {
            id: 'status-codes-2xx-4xx-5xx',
            title: 'HTTP Status Codes',
            priority: 'hot',
            estimatedMinutes: 45,
            description:
              '1xx Informational: 100 Continue. 2xx Success: 200 OK, ' +
              '201 Created, 204 No Content. 3xx Redirection: 301 Moved ' +
              'Permanently, 302 Found, 304 Not Modified. 4xx Client Errors: ' +
              '400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, ' +
              '405 Method Not Allowed, 409 Conflict, 422 Unprocessable Entity, ' +
              '429 Too Many Requests. 5xx Server Errors: 500 Internal Server ' +
              'Error, 502 Bad Gateway, 503 Service Unavailable.',
          },
          {
            id: 'idempotency',
            title: 'Idempotency',
            priority: 'warm',
            estimatedMinutes: 30,
            description:
              'An operation is idempotent if applying it multiple times yields ' +
              'the same result as applying it once. GET, PUT, DELETE, HEAD, ' +
              'OPTIONS are idempotent; POST and PATCH are typically not. ' +
              'Importance for retry logic in distributed systems: safe to retry ' +
              'idempotent requests on network failure. Idempotency keys for ' +
              'making POST operations idempotent (payment APIs).',
          },
          {
            id: 'content-type-accept-headers',
            title: 'Content-Type & Accept Headers',
            priority: 'warm',
            estimatedMinutes: 30,
            description:
              'Content-Type describes the format of the request body ' +
              '(application/json, application/xml, multipart/form-data, ' +
              'application/x-www-form-urlencoded). Accept header tells the ' +
              'server the preferred response format. Media type negotiation: ' +
              'server selects from Accept options by quality factor (q=0.9). ' +
              'Covers charset parameter (application/json; charset=UTF-8) and ' +
              'vendor MIME types.',
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // MODULE 3 – Appium
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'appium',
    number: 3,
    title: 'Appium',
    subtitle: 'Mobile Test Automation',
    priority: 'important',
    difficulty: 'medium',
    estimatedHours: 6,
    description:
      'Automate Android and iOS applications using Appium, the open-source ' +
      'mobile automation framework. Covers Appium architecture, desired ' +
      'capabilities, locator strategies unique to mobile (Accessibility ID, ' +
      'UiAutomator), touch gestures, and the difference between native, ' +
      'hybrid, and web app automation.',
    color: 'from-purple-500 to-pink-500',
    icon: '📱',
    topicGroups: [
      {
        title: 'Architecture & Setup',
        topics: [
          {
            id: 'appium-server-architecture',
            title: 'Appium Server Architecture',
            priority: 'hot',
            estimatedMinutes: 60,
            description:
              'Appium follows a client-server architecture: the Appium server ' +
              '(Node.js) listens for WebDriver protocol commands from test clients ' +
              '(Java, Python, JS) and delegates to platform-specific drivers ' +
              '(UiAutomator2 for Android, XCUITest for iOS). Session lifecycle: ' +
              'createSession with capabilities → execute commands → deleteSession. ' +
              'Covers Appium Desktop, Appium Server CLI, and server flags.',
          },
          {
            id: 'desired-capabilities',
            title: 'Desired Capabilities',
            priority: 'hot',
            estimatedMinutes: 60,
            description:
              'Configure Appium sessions using DesiredCapabilities or Options objects. ' +
              'Required capabilities: platformName, deviceName, automationName ' +
              '(UiAutomator2/XCUITest), app (APK/IPA path or app package). ' +
              'Android-specific: appPackage, appActivity, avd, unicodeKeyboard. ' +
              'iOS-specific: udid, bundleId, xcodeOrgId. ' +
              'Understand capability merging and W3C capability format in Appium 2.',
          },
          {
            id: 'appium-vs-selenium',
            title: 'Appium vs Selenium',
            priority: 'warm',
            estimatedMinutes: 30,
            description:
              'Both use the WebDriver protocol, but Appium extends it for ' +
              'mobile: additional commands for gestures, app management, ' +
              'device interaction. Appium acts as a "mobile Selenium" with ' +
              'vendor-specific drivers. Key differences: no browser launch ' +
              'commands; instead app install/launch; different locator ' +
              'strategies (Accessibility ID vs CSS); platform-specific ' +
              'element hierarchies.',
          },
          {
            id: 'appium-inspector',
            title: 'Appium Inspector',
            priority: 'warm',
            estimatedMinutes: 45,
            description:
              'Use Appium Inspector (successor to Appium Desktop) to inspect ' +
              'mobile UI element hierarchies, identify element attributes ' +
              '(resource-id, content-desc, class, text), and generate locators. ' +
              'Connect Inspector to a running Appium server session. Covers ' +
              'XML source inspection, recording interactions, and testing ' +
              'locators interactively before writing test code.',
          },
        ],
      },
      {
        title: 'Locators & Interactions',
        topics: [
          {
            id: 'accessibility-id-uiautomator',
            title: 'Accessibility ID & UiAutomator Selectors',
            priority: 'hot',
            estimatedMinutes: 60,
            description:
              'Accessibility ID: maps to content-description (Android) or ' +
              'accessibility label (iOS) – preferred cross-platform locator. ' +
              'UiAutomator2 selectors: UiSelector().resourceId(), ' +
              'UiSelector().text(), UiSelector().className().instance(n), ' +
              'and UiScrollable for scrolling to elements. XPath in Appium: ' +
              'functional but slow; prefer Accessibility ID or class chains. ' +
              'iOS: -ios predicate string and -ios class chain for XCUITest.',
          },
          {
            id: 'touch-actions',
            title: 'Touch Actions & Gestures',
            priority: 'hot',
            estimatedMinutes: 60,
            description:
              'Simulate mobile gestures using Appium\'s W3C Actions API (Appium 2) ' +
              'and legacy TouchAction/MultiTouchAction (Appium 1). Gestures: ' +
              'tap, longPress, swipe, scroll, pinch-to-zoom, double-tap, ' +
              'and drag-and-drop. Coordinate-based vs element-based gestures. ' +
              'Platform differences: Android (UiAutomator2 gestures) vs ' +
              'iOS (XCUITest gestures). Mobile Gestures Plugin in Appium 2.',
          },
          {
            id: 'uiautomator2-driver',
            title: 'UiAutomator2 Driver',
            priority: 'warm',
            estimatedMinutes: 45,
            description:
              'UiAutomator2 is the default Android automation driver in Appium 2. ' +
              'Architecture: bootstraps a test server APK on the device that ' +
              'processes commands via socket. Supports: Android system gestures, ' +
              'app management commands (install, activate, terminate), ' +
              'device interaction (lock, unlock, rotate), and clipboard access. ' +
              'Covers espresso driver as an alternative for white-box testing.',
          },
          {
            id: 'native-hybrid-web-app',
            title: 'Native, Hybrid & Web App Testing',
            priority: 'warm',
            estimatedMinutes: 45,
            description:
              'Native apps: fully platform-specific, use mobile locators. ' +
              'Hybrid apps: WebView embedded in native shell; switch contexts ' +
              'with driver.getContextHandles() and driver.context("WEBVIEW_*") ' +
              'then use Selenium locators. Mobile web: open browser app, use ' +
              'ChromeDriver/SafariDriver embedded in Appium. Understand ' +
              'NATIVE_APP vs WEBVIEW context switching for hybrid testing.',
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // MODULE 4 – REST, SOAP & WSDL
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'rest-soap-wsdl',
    number: 4,
    title: 'REST, SOAP & WSDL',
    subtitle: 'Web Service Architectures',
    priority: 'important',
    difficulty: 'medium',
    estimatedHours: 5,
    description:
      'Understand the principles behind web service architectures: REST ' +
      'constraints, stateless communication, HATEOAS, and resource modelling. ' +
      'Compare REST with SOAP, study WSDL structure, and understand when each ' +
      'protocol is appropriate. Critical for Cognizant interviews that probe ' +
      'conceptual understanding alongside hands-on API testing skills.',
    color: 'from-orange-500 to-red-500',
    icon: '🔗',
    topicGroups: [
      {
        title: 'REST Principles',
        topics: [
          {
            id: 'rest-6-constraints',
            title: 'REST 6 Architectural Constraints',
            priority: 'hot',
            estimatedMinutes: 60,
            description:
              'Fielding\'s six REST constraints: (1) Client-Server separation ' +
              '(UI/logic decoupled from data storage). (2) Statelessness: each ' +
              'request contains all context; no server-side session. (3) Cacheability: ' +
              'responses must declare themselves cacheable or non-cacheable. ' +
              '(4) Uniform Interface: resource identification, manipulation via ' +
              'representations, self-descriptive messages, HATEOAS. (5) Layered ' +
              'System: client unaware of intermediaries. (6) Code on Demand (optional): ' +
              'server sends executable code (JavaScript).',
          },
          {
            id: 'statelessness',
            title: 'Statelessness in REST',
            priority: 'hot',
            estimatedMinutes: 45,
            description:
              'Each HTTP request must contain all information needed to process ' +
              'it (auth token, session context, request data). Server stores no ' +
              'client state between requests. Benefits: scalability (any server ' +
              'can handle any request), reliability (no session synchronisation), ' +
              'visibility (full request context for monitoring). Trade-off: ' +
              'increased payload size per request. JWT as a stateless auth mechanism.',
          },
          {
            id: 'hateoas',
            title: 'HATEOAS',
            priority: 'warm',
            estimatedMinutes: 30,
            description:
              'Hypermedia As The Engine Of Application State: REST responses ' +
              'include hyperlinks to related actions/resources, allowing clients ' +
              'to navigate the API without prior knowledge. Example: a GET /orders/1 ' +
              'response includes links for cancel, pay, shipment tracking. ' +
              'Enables API discoverability and decouples client from URL structure. ' +
              'Most real-world APIs implement partial HATEOAS (Level 3 Richardson ' +
              'Maturity Model).',
          },
          {
            id: 'rest-vs-graphql',
            title: 'REST vs GraphQL',
            priority: 'warm',
            estimatedMinutes: 45,
            description:
              'REST: multiple endpoints, each returning a fixed structure; ' +
              'over-fetching (extra fields) and under-fetching (multiple calls) ' +
              'are common issues. GraphQL: single endpoint, client specifies ' +
              'exact data shape via query language; eliminates over/under-fetching. ' +
              'REST advantages: caching (HTTP-native), simplicity, wider tooling. ' +
              'GraphQL advantages: flexibility, typed schema, introspection. ' +
              'When to choose each.',
          },
          {
            id: 'resource-based-urls',
            title: 'Resource-Based URL Design',
            priority: 'warm',
            estimatedMinutes: 30,
            description:
              'RESTful URL conventions: use nouns not verbs (GET /users, not ' +
              'GET /getUsers), plural resource names (/users, /orders), ' +
              'hierarchical relationships (/users/{id}/orders), query params ' +
              'for filtering/sorting/pagination (?status=active&page=2). ' +
              'Avoid anti-patterns: /getUser, /deleteUser?id=1. URL versioning ' +
              '(/v1/users vs Accept-Version header vs subdomain).',
          },
        ],
      },
      {
        title: 'SOAP & WSDL',
        topics: [
          {
            id: 'soap-vs-rest',
            title: 'SOAP vs REST',
            priority: 'hot',
            estimatedMinutes: 60,
            description:
              'SOAP (Simple Object Access Protocol): protocol with strict ' +
              'standards, XML-only, built-in error handling (SOAP Fault), ' +
              'WS-Security for enterprise-grade security, and ACID transaction ' +
              'support. REST: architectural style, protocol-agnostic, supports ' +
              'JSON/XML/any format, stateless, HTTP-native caching. Comparison: ' +
              'SOAP for banking/enterprise integrations; REST for web/mobile APIs. ' +
              'Performance: REST typically faster due to lighter payloads.',
          },
          {
            id: 'wsdl-structure',
            title: 'WSDL Structure',
            priority: 'warm',
            estimatedMinutes: 45,
            description:
              'Web Services Description Language (WSDL) XML document that ' +
              'describes a SOAP service. Key elements: <types> (XML Schema for ' +
              'data types), <message> (request/response message definitions), ' +
              '<portType> (abstract operations), <binding> (protocol/encoding), ' +
              '<service> (endpoint URL). WSDL 1.1 vs WSDL 2.0 differences. ' +
              'Using SoapUI or Postman to import WSDL and generate requests.',
          },
          {
            id: 'soap-message-structure',
            title: 'SOAP Message Structure',
            priority: 'warm',
            estimatedMinutes: 45,
            description:
              'SOAP envelope: <Envelope> root element with SOAP namespace. ' +
              '<Header> (optional): WS-Security tokens, routing info, ' +
              'transaction IDs. <Body>: the actual request or response payload. ' +
              '<Fault>: error element with faultCode, faultString, detail. ' +
              'SOAP 1.1 vs 1.2 namespace and fault structure differences. ' +
              'Content-Type: text/xml (SOAP 1.1) vs application/soap+xml (1.2).',
          },
          {
            id: 'when-to-use-soap',
            title: 'When to Use SOAP',
            priority: 'normal',
            estimatedMinutes: 20,
            description:
              'Choose SOAP when: formal contract is required (WSDL), enterprise ' +
              'security standards needed (WS-Security, WS-Trust), ACID ' +
              'transactions required (WS-AtomicTransaction), stateful operations ' +
              'needed (WS-ReliableMessaging), or working with legacy enterprise ' +
              'systems (banking, telecom, government). REST is preferred for ' +
              'modern, high-throughput, resource-oriented web/mobile APIs.',
          },
          {
            id: 'endpoints-and-bindings',
            title: 'Endpoints & Bindings',
            priority: 'normal',
            estimatedMinutes: 20,
            description:
              'WSDL binding: maps abstract portType operations to a concrete ' +
              'protocol (SOAP/HTTP) and encoding style (document/literal vs ' +
              'rpc/encoded). Endpoint (service port): the URL where the service ' +
              'is hosted. Multiple bindings can expose the same portType over ' +
              'different transports (SOAP over HTTP, SOAP over JMS). ' +
              'Covers testing SOAP endpoints with SoapUI and REST Assured XML support.',
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // MODULE 5 – Performance Testing
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'performance-testing',
    number: 5,
    title: 'Performance Testing',
    subtitle: 'JMeter & Load Testing',
    priority: 'important',
    difficulty: 'medium',
    estimatedHours: 6,
    description:
      'Plan, execute, and analyse performance tests using Apache JMeter. ' +
      'Covers test plan architecture, thread groups, samplers, listeners, ' +
      'timers, CSV data sets, and assertions. Includes load testing concepts ' +
      '(load vs stress vs spike vs soak), key metrics (throughput, latency, ' +
      'response time), bottleneck identification, and a comparison with ' +
      'HP LoadRunner for enterprise contexts.',
    color: 'from-yellow-500 to-orange-500',
    icon: '⚡',
    topicGroups: [
      {
        title: 'JMeter Core',
        topics: [
          {
            id: 'jmeter-architecture',
            title: 'JMeter Architecture',
            priority: 'hot',
            estimatedMinutes: 60,
            description:
              'JMeter is a Java-based open-source performance testing tool. ' +
              'Architecture: GUI mode (test design), non-GUI mode (CLI execution ' +
              'for CI/load generation), and distributed mode (Controller + ' +
              'Remote Engines). Core engine: test plan traversal via thread groups, ' +
              'samplers send requests, listeners collect results. ' +
              'JMeter processes results via result collectors; back-end listener ' +
              'for real-time streaming to InfluxDB/Grafana.',
          },
          {
            id: 'thread-groups-samplers-listeners',
            title: 'Thread Groups, Samplers & Listeners',
            priority: 'hot',
            estimatedMinutes: 60,
            description:
              'Thread Group: defines virtual users (Number of Threads), ramp-up ' +
              'period (seconds to reach full load), and loop count. Samplers: ' +
              'HTTP Request (most common), JDBC Request, FTP, JMS, TCP. ' +
              'Listeners: View Results Tree (debug), Summary Report, Aggregate ' +
              'Report, Graph Results, Response Times Over Time. Best practice: ' +
              'disable GUI listeners during load tests; use non-GUI mode + ' +
              'backend listener.',
          },
          {
            id: 'test-plan-structure',
            title: 'Test Plan Structure',
            priority: 'hot',
            estimatedMinutes: 45,
            description:
              'JMeter Test Plan hierarchy: Test Plan → Thread Group → ' +
              'Config Elements (HTTP Header Manager, HTTP Cookie Manager, ' +
              'HTTP Cache Manager, CSV Data Set Config) → Samplers → ' +
              'Pre/Post Processors (JSR223, Regular Expression Extractor, ' +
              'JSON Extractor) → Assertions → Listeners. Logic Controllers: ' +
              'If, While, For Each, Random, Throughput Controller for ' +
              'complex test scenarios.',
          },
          {
            id: 'response-assertions',
            title: 'Response Assertions',
            priority: 'warm',
            estimatedMinutes: 45,
            description:
              'Validate responses during load tests: Response Assertion (text, ' +
              'response code, response message, headers), JSON Assertion ' +
              '(JSONPath expressions), Duration Assertion (max response time), ' +
              'Size Assertion (response size bounds), and XPath Assertion. ' +
              'Assertions failing marks the sample as failed; affects error ' +
              'rate in reports. Covers Scope (main/sub-samples) and test field ' +
              'options.',
          },
          {
            id: 'timers-think-time',
            title: 'Timers & Think Time',
            priority: 'warm',
            estimatedMinutes: 30,
            description:
              'Simulate realistic user behaviour by adding delays between requests. ' +
              'Constant Timer: fixed delay. Gaussian Random Timer: normally ' +
              'distributed delay (mean + deviation). Uniform Random Timer: ' +
              'random between 0 and max. Throughput Shaping Timer: control ' +
              'requests per second over time. Think time modelling: ' +
              'use 1-3 second delays to avoid unrealistically aggressive load.',
          },
          {
            id: 'csv-data-set',
            title: 'CSV Data Set Config',
            priority: 'warm',
            estimatedMinutes: 30,
            description:
              'Parameterise JMeter tests with external CSV data: user credentials, ' +
              'search terms, product IDs. Configure: filename, variable names, ' +
              'delimiter, recycle on EOF, stop thread on EOF, and sharing mode ' +
              '(all threads vs current thread group). Access variables as ' +
              '${variableName} in samplers. Combine with thread groups for ' +
              'unique-user simulations.',
          },
        ],
      },
      {
        title: 'Load Testing Concepts',
        topics: [
          {
            id: 'load-stress-spike-soak',
            title: 'Load, Stress, Spike & Soak Testing',
            priority: 'hot',
            estimatedMinutes: 60,
            description:
              'Load Test: validate system behaviour under expected (and slightly ' +
              'above) production load to confirm SLAs. Stress Test: push beyond ' +
              'normal capacity to find breaking point (at what load does it fail?). ' +
              'Spike Test: sudden dramatic increase in load (flash sale scenario) ' +
              'to test elasticity. Soak/Endurance Test: sustained load over hours ' +
              'to detect memory leaks, connection pool exhaustion, and gradual ' +
              'performance degradation.',
          },
          {
            id: 'throughput-latency-response-time',
            title: 'Throughput, Latency & Response Time',
            priority: 'hot',
            estimatedMinutes: 60,
            description:
              'Throughput: requests processed per second (RPS/TPS); key capacity ' +
              'metric. Response Time: total time from request sent to last byte ' +
              'received. Latency: network + server processing time (excludes ' +
              'transfer time for large responses). Percentiles (P50, P90, P95, ' +
              'P99): distribution of response times; P99 reveals worst-case user ' +
              'experience. Apdex score: user satisfaction index based on response ' +
              'time thresholds.',
          },
          {
            id: 'bottleneck-identification',
            title: 'Bottleneck Identification',
            priority: 'hot',
            estimatedMinutes: 45,
            description:
              'Systematically identify performance bottlenecks: CPU saturation ' +
              '(high utilisation → vertical scale or optimise), memory pressure ' +
              '(GC pauses, OOM errors), I/O bottlenecks (disk/network saturation), ' +
              'database slow queries (missing indexes, N+1 queries), and thread ' +
              'pool exhaustion. Tools: JMeter results + server metrics (JConsole, ' +
              'VisualVM, Prometheus/Grafana). Amdahl\'s Law for parallelisation limits.',
          },
          {
            id: 'concurrent-vs-virtual-users',
            title: 'Concurrent vs Virtual Users',
            priority: 'warm',
            estimatedMinutes: 30,
            description:
              'Virtual Users (VUs): simulated user sessions actively executing ' +
              'the test script (including think time). Concurrent Users: users ' +
              'simultaneously sending requests at a given moment (subset of VUs ' +
              'during think time). Active/Concurrent Users = VUs × (request time / ' +
              'total iteration time). Understand Little\'s Law: L = λW ' +
              '(avg users = arrival rate × avg time in system) for capacity planning.',
          },
        ],
      },
      {
        title: 'LoadRunner',
        topics: [
          {
            id: 'jmeter-vs-loadrunner',
            title: 'JMeter vs LoadRunner',
            priority: 'warm',
            estimatedMinutes: 45,
            description:
              'JMeter: open-source, Java-based, GUI + CLI, large plugin ecosystem, ' +
              'lower learning curve, community support, runs on any OS. ' +
              'LoadRunner (Micro Focus): commercial, enterprise-grade, supports ' +
              '50+ protocols, advanced analysis and correlation, professional ' +
              'support. LoadRunner Community Edition is free up to 50 VUs. ' +
              'Cognizant context: LoadRunner used in large banking/telecom projects; ' +
              'JMeter for agile/web API projects.',
          },
          {
            id: 'vusers-and-scenarios',
            title: 'VUsers & Scenarios in LoadRunner',
            priority: 'warm',
            estimatedMinutes: 30,
            description:
              'VUser (Virtual User) scripts are recorded/written in C-like script ' +
              'using VuGen (Virtual User Generator). Scenario types: Goal-Oriented ' +
              '(define target RPS/response time, LR adjusts VUsers) and ' +
              'Manual (explicitly set VUsers, duration, ramp-up). Controller ' +
              'manages scenario execution, distributes VUsers across load ' +
              'generators. Analysis module provides detailed reports and graphs.',
          },
          {
            id: 'loadrunner-components',
            title: 'LoadRunner Components',
            priority: 'normal',
            estimatedMinutes: 20,
            description:
              'VuGen (Virtual User Generator): record and develop VUser scripts ' +
              'using built-in protocols. Controller: design, manage, and monitor ' +
              'load test scenarios. Load Generators: machines that execute VUser ' +
              'scripts (can be distributed). Analysis: post-test reporting and ' +
              'graph generation. LoadRunner Enterprise (formerly Performance ' +
              'Center): web-based management for enterprise-scale testing.',
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // MODULE 6 – General SDET Concepts
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'general-sdet',
    number: 6,
    title: 'General SDET Concepts',
    subtitle: 'Testing Fundamentals & DevOps',
    priority: 'good-to-know',
    difficulty: 'easy',
    estimatedHours: 4,
    description:
      'Foundational testing knowledge and DevOps tooling expected of any SDET. ' +
      'Covers the software development and testing lifecycles, testing types, ' +
      'test design techniques (BVA, equivalence partitioning), bug lifecycle, ' +
      'CI/CD pipelines with Jenkins, Maven build management, and Git ' +
      'version control — the glue holding modern QA engineering together.',
    color: 'from-slate-500 to-gray-500',
    icon: '🎯',
    topicGroups: [
      {
        title: 'Testing Fundamentals',
        topics: [
          {
            id: 'sdlc-vs-stlc',
            title: 'SDLC vs STLC',
            priority: 'hot',
            estimatedMinutes: 45,
            description:
              'SDLC (Software Development Life Cycle): phases from Requirements → ' +
              'Design → Development → Testing → Deployment → Maintenance. ' +
              'Models: Waterfall, Agile (Scrum/Kanban), V-Model, Spiral. ' +
              'STLC (Software Testing Life Cycle): phases parallel to SDLC: ' +
              'Requirement Analysis → Test Planning → Test Case Design → ' +
              'Test Environment Setup → Test Execution → Test Closure. ' +
              'Entry/exit criteria for each phase.',
          },
          {
            id: 'testing-types',
            title: 'Testing Types',
            priority: 'hot',
            estimatedMinutes: 45,
            description:
              'Functional: Unit (developer-written, isolated), Integration ' +
              '(module interaction), System (end-to-end), UAT (user acceptance). ' +
              'Non-functional: Performance, Load, Stress, Security, Usability, ' +
              'Accessibility. Maintenance: Regression (re-test after changes), ' +
              'Smoke (build verification), Sanity (focused regression). ' +
              'Black-box (behaviour only), White-box (code paths), ' +
              'Grey-box (partial knowledge). Shift-left testing principle.',
          },
          {
            id: 'bva-equivalence-partitioning',
            title: 'BVA & Equivalence Partitioning',
            priority: 'warm',
            estimatedMinutes: 30,
            description:
              'Equivalence Partitioning (EP): divide input domain into classes ' +
              'where all values behave the same; test one value per class to ' +
              'reduce test cases. Boundary Value Analysis (BVA): focus on values ' +
              'at the edges of EP classes (min, min-1, min+1, max, max-1, max+1) ' +
              'where defects are most likely. Example: age field (18-60): test ' +
              '17, 18, 19, 59, 60, 61. Apply both techniques for systematic ' +
              'input coverage.',
          },
          {
            id: 'regression-testing',
            title: 'Regression Testing',
            priority: 'warm',
            estimatedMinutes: 30,
            description:
              'Re-execute existing tests after code changes to ensure no new ' +
              'defects were introduced. Types: Full regression (all tests), ' +
              'Partial/Selective regression (impact analysis, changed modules), ' +
              'Progressive regression (new tests for new features). Automation ' +
              'necessity: manual regression is unsustainable in agile sprints. ' +
              'Regression suite maintenance: remove obsolete tests, update ' +
              'for UI changes, add tests for fixed bugs.',
          },
          {
            id: 'bug-life-cycle',
            title: 'Bug / Defect Life Cycle',
            priority: 'warm',
            estimatedMinutes: 30,
            description:
              'Defect states: New → Assigned → Open (under investigation) → ' +
              'Fixed → Retest → Closed. Additional states: Deferred (postponed), ' +
              'Rejected (not a bug / cannot reproduce), Duplicate, Won\'t Fix. ' +
              'Good bug report: title, steps to reproduce, expected vs actual ' +
              'result, severity (Blocker/Critical/Major/Minor/Trivial), ' +
              'priority (P1-P4), environment, screenshots/logs, and build version.',
          },
        ],
      },
      {
        title: 'CI/CD & Tools',
        topics: [
          {
            id: 'cicd-basics',
            title: 'CI/CD Basics',
            priority: 'warm',
            estimatedMinutes: 45,
            description:
              'Continuous Integration (CI): developers merge code frequently, ' +
              'automated build and test pipeline runs on every push. Continuous ' +
              'Delivery (CD): automated deployment to staging after CI success; ' +
              'production deployment is manual. Continuous Deployment: every ' +
              'green CI automatically deploys to production. Key benefits: ' +
              'early bug detection, faster feedback, reduced integration hell. ' +
              'SDET role in CI: maintain green pipeline, fast smoke suite.',
          },
          {
            id: 'jenkins-selenium',
            title: 'Jenkins & Selenium Integration',
            priority: 'hot',
            estimatedMinutes: 60,
            description:
              'Integrate Selenium tests into Jenkins pipeline: configure Maven ' +
              'project or Pipeline job, trigger on Git push (webhook), run tests ' +
              'with mvn test, publish TestNG/Surefire XML reports using the ' +
              'JUnit/TestNG Results plugin, archive screenshots as build artefacts, ' +
              'and send email notifications on failure. Covers Jenkinsfile ' +
              '(declarative pipeline), stages, and parallel test execution ' +
              'on Selenium Grid via Jenkins.',
          },
          {
            id: 'maven-build-tools',
            title: 'Maven Build & Dependency Management',
            priority: 'warm',
            estimatedMinutes: 45,
            description:
              'Maven as the standard Java build tool for SDET projects. ' +
              'pom.xml: project structure, dependencies (Selenium, TestNG, ' +
              'REST Assured, Appium), build plugins (maven-surefire-plugin for ' +
              'TestNG XML execution, maven-compiler-plugin). Lifecycle phases: ' +
              'validate → compile → test → package → verify → install → deploy. ' +
              'mvn clean test -Dtest=SmokeTests for selective execution. ' +
              'Dependency scopes: test, compile, provided, runtime.',
          },
          {
            id: 'git-version-control',
            title: 'Git Version Control',
            priority: 'warm',
            estimatedMinutes: 30,
            description:
              'Essential Git commands for SDET daily workflow: git clone, ' +
              'git pull/fetch, git checkout -b (feature branch), git add, ' +
              'git commit -m, git push, git merge, git rebase. Branching ' +
              'strategies: GitFlow (main, develop, feature, release, hotfix) ' +
              'and trunk-based development. Pull request workflow, code review ' +
              'for test scripts, .gitignore for test artefacts (target/, ' +
              'screenshots/, test-output/).',
          },
        ],
      },
    ],
  },
];

export const allTopics = modules.flatMap((m) =>
  m.topicGroups.flatMap((g) =>
    g.topics.map((t) => ({ ...t, moduleId: m.id, moduleTitle: m.title }))
  )
);
