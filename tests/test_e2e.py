import os
import time

import pytest
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select, WebDriverWait

BASE_URL = os.getenv("BASE_URL", "http://localhost:3000")
PASSWORD = "Test@12345"
TIMEOUT = 10

# If a test fails with "None of these selectors matched",
# fix the matching list here. The tests use these lists to find form fields.
NAME_SELECTORS = ["input[name='name']", "input[placeholder*='name' i]", "input[type='text']"]
EMAIL_SELECTORS = ["input[type='email']", "input[name='email']"]
PASSWORD_SELECTORS = ["input[type='password']"]
SUBMIT_SELECTORS = ["button[type='submit']"]


# ---------- helpers ----------

def unique_email(prefix="user"):
    """A new email each run, so re-running the tests never collides."""
    return f"{prefix}_{int(time.time() * 1000)}@test.com"


def wait_for(driver, condition, timeout=TIMEOUT):
    return WebDriverWait(driver, timeout).until(condition)


def body_text(driver):
    """Only the text a user can see (ignores hidden scripts and markup)."""
    return driver.find_element(By.TAG_NAME, "body").text.lower()


def find_first(driver, selectors):
    for selector in selectors:
        found = driver.find_elements(By.CSS_SELECTOR, selector)
        if found:
            return found[0]
    raise NoSuchElementException(f"None of these selectors matched: {selectors}")


def fill(driver, selectors, value):
    element = find_first(driver, selectors)
    element.clear()
    element.send_keys(value)


def choose_role(select_element, role):
    dropdown = Select(select_element)
    for pick in (lambda: dropdown.select_by_value(role),
                 lambda: dropdown.select_by_visible_text(role.capitalize())):
        try:
            pick()
            return
        except NoSuchElementException:
            continue


def register_user(driver, email, role="beneficiary", name="Test User"):
    driver.get(f"{BASE_URL}/register")
    wait_for(driver, lambda d: d.find_elements(By.CSS_SELECTOR, "input"))
    fill(driver, NAME_SELECTORS, name)
    fill(driver, EMAIL_SELECTORS, email)
    fill(driver, PASSWORD_SELECTORS, PASSWORD)
    dropdowns = driver.find_elements(By.TAG_NAME, "select")
    if dropdowns:
        choose_role(dropdowns[0], role)
    find_first(driver, SUBMIT_SELECTORS).click()


def registration_finished(driver):
    return "/register" not in driver.current_url or "success" in body_text(driver)


def login_user(driver, email, password=PASSWORD):
    driver.get(f"{BASE_URL}/login")
    wait_for(driver, lambda d: d.find_elements(By.CSS_SELECTOR, "input"))
    fill(driver, EMAIL_SELECTORS, email)
    fill(driver, PASSWORD_SELECTORS, password)
    find_first(driver, SUBMIT_SELECTORS).click()


@pytest.fixture
def beneficiary(driver):
    """Registers a fresh beneficiary through the UI and returns their email."""
    email = unique_email("benef")
    register_user(driver, email)
    wait_for(driver, registration_finished)
    return email


# ---------- tests ----------

def test_home_page_loads(driver):
    driver.get(BASE_URL)
    wait_for(driver, lambda d: "tracefund" in body_text(d))
    assert "tracefund" in body_text(driver)


def test_register_new_beneficiary(driver):
    register_user(driver, unique_email("benef"))
    wait_for(driver, registration_finished)
    assert registration_finished(driver)


def test_valid_login_redirects_to_beneficiary(driver, beneficiary):
    login_user(driver, beneficiary)
    wait_for(driver, EC.url_contains("/beneficiary"))
    assert "/beneficiary" in driver.current_url


def test_invalid_login_stays_on_login_page(driver):
    login_user(driver, "nobody@test.com", "wrong-password")
    wait_for(driver, lambda d: any(
        word in body_text(d) for word in ("invalid", "incorrect", "error", "failed", "wrong")
    ))
    assert "/login" in driver.current_url


def test_beneficiary_dashboard_shows_wallet(driver, beneficiary):
    login_user(driver, beneficiary)
    wait_for(driver, EC.url_contains("/beneficiary"))
    wait_for(driver, lambda d: "wallet" in body_text(d))
    assert "wallet" in body_text(driver)


def test_logout_clears_session(driver, beneficiary):
    login_user(driver, beneficiary)
    wait_for(driver, EC.url_contains("/beneficiary"))
    # finds a button or link whose text contains "logout", any capitalisation
    logout = wait_for(driver, EC.element_to_be_clickable((
        By.XPATH,
        "//*[self::button or self::a]"
        "[contains(translate(normalize-space(.), 'LOGOUT', 'logout'), 'logout')]",
    )))
    logout.click()
    wait_for(driver, lambda d: "/beneficiary" not in d.current_url)
    assert driver.execute_script("return window.localStorage.length") == 0
