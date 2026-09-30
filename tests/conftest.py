import os

import pytest
from selenium import webdriver
from selenium.webdriver.chrome.options import Options


@pytest.fixture
def driver():
    """Opens a fresh Chrome window for each test and closes it afterwards."""
    options = Options()
    if os.getenv("HEADLESS") == "1":
        options.add_argument("--headless=new")  # run without showing the window
    options.add_argument("--window-size=1400,900")

    browser = webdriver.Chrome(options=options)
    yield browser      # the test runs at this point
    browser.quit()     # always runs, even if the test failed
