// Enhanced Website Creation Wizard JavaScript - 6 Steps
// Vanilla JavaScript implementation - DEBUGGED VERSION

// Global variables
let currentStep = 1;
let currentLicensePlugin = null;
let wizardData = {
  platform: null,
  version: null,
  storeInfo: {
    name: "Sample Store",
  },
  theme: "luma",
  plugins: {},
  licenseKeys: {},
  sampleData: "with_sample",
  styling: {
    colors: {
      primary: "#4e54c8",
      secondary: "#8f94fb",
      tertiary: "#19b78a",
    },
    fonts: "default",
    useDefaultFont: true,
  },
};

// Plugin data (loaded from JSON)
let pluginData = {};

// Platform data
const platformData = {
  magento: {
    versions: {
      "2.4.7": {
        php: "8.3",
        mariadb: "10.6",
        redis: "7.2",
        opensearch: "2.11",
      },
      "2.4.6": {
        php: "8.2",
        mariadb: "10.5",
        redis: "7.0",
        opensearch: "2.9",
      },
      "2.4.5": {
        php: "8.1",
        mariadb: "10.4",
        redis: "6.2",
        opensearch: "2.6",
      },
      "2.4.4": {
        php: "8.0",
        mariadb: "10.4",
        redis: "6.0",
        opensearch: "2.4",
      },
      "2.3.7": {
        php: "7.4",
        mariadb: "10.3",
        redis: "5.0",
        opensearch: "N/A",
      },
    },
  },
  laravel: {
    versions: {
      11: {
        php: "8.2",
        mariadb: "10.6",
        redis: "7.2",
        opensearch: "N/A",
      },
      10: {
        php: "8.1",
        mariadb: "10.4",
        redis: "6.2",
        opensearch: "N/A",
      },
      9: {
        php: "8.0",
        mariadb: "10.3",
        redis: "6.0",
        opensearch: "N/A",
      },
      8: {
        php: "7.4",
        mariadb: "10.3",
        redis: "5.0",
        opensearch: "N/A",
      },
      7: {
        php: "7.3",
        mariadb: "10.2",
        redis: "5.0",
        opensearch: "N/A",
      },
    },
  },
  wordpress: {
    versions: {
      6.5: {
        php: "8.1",
        mariadb: "10.4",
        redis: "7.0",
        opensearch: "N/A",
      },
      6.4: {
        php: "8.0",
        mariadb: "10.3",
        redis: "6.0",
        opensearch: "N/A",
      },
      6.3: {
        php: "7.4",
        mariadb: "10.2",
        redis: "5.0",
        opensearch: "N/A",
      },
      6.2: {
        php: "7.3",
        mariadb: "10.1",
        redis: "5.0",
        opensearch: "N/A",
      },
      5.9: {
        php: "7.2",
        mariadb: "10.0",
        redis: "4.0",
        opensearch: "N/A",
      },
    },
  },
};

// Theme preview data
const themePreviewData = {
  luma: {
    name: "Luma Theme",
    desktop:
      "https://placehold.co/800x600/f8f9fa/6c757d?text=Luma+Desktop+Preview",
    mobile:
      "https://placehold.co/400x600/f8f9fa/6c757d?text=Luma+Mobile+Preview",
  },
  hyva: {
    name: "Hyvä Theme",
    desktop:
      "https://placehold.co/800x600/e3f2fd/1976d2?text=Hyva+Desktop+Preview",
    mobile:
      "https://placehold.co/400x600/e3f2fd/1976d2?text=Hyva+Mobile+Preview",
  },
  default: {
    name: "Default Theme",
    desktop:
      "https://placehold.co/800x600/ffffff/666666?text=Default+Desktop+Preview",
    mobile:
      "https://placehold.co/400x600/ffffff/666666?text=Default+Mobile+Preview",
  },
  ecommerce: {
    name: "E-commerce Pro",
    desktop:
      "https://placehold.co/800x600/f0f0f0/333333?text=Ecommerce+Desktop+Preview",
    mobile:
      "https://placehold.co/400x600/f0f0f0/333333?text=Ecommerce+Mobile+Preview",
  },
};

// Dependency icons mapping
const dependencyIcons = {
  php: "fab fa-php",
  mariadb: "fas fa-database",
  redis: "fas fa-memory",
  opensearch: "fas fa-search",
};

// Utility functions for DOM manipulation
function $(selector) {
  if (selector.startsWith("#")) {
    return document.getElementById(selector.slice(1));
  }
  return document.querySelector(selector);
}

function $$(selector) {
  return document.querySelectorAll(selector);
}

// Event delegation helper
function delegate(parent, selector, event, handler) {
  parent.addEventListener(event, function (e) {
    const target = e.target.closest(selector);
    if (target) {
      handler.call(target, e);
    }
  });
}

// Initialize wizard when DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM Ready - Initializing wizard...");

  // Debug: Check if elements exist
  console.log("Step content elements found:", $$(".step-content").length);
  console.log("Current step content:", $(`[data-step="${currentStep}"]`));

  // Set default values first
  wizardData.storeInfo = wizardData.storeInfo || {};
  wizardData.storeInfo.name = "Sample Store";

  // Initialize in order
  loadPluginData();
  loadWizardData();
  initializeEventHandlers();

  // Force show first step
  setTimeout(() => {
    updateDisplay();

    // Force populate store name field
    const storeNameInput = $("#storeName");
    if (storeNameInput) {
      storeNameInput.value = wizardData.storeInfo.name;
      console.log("Store name field populated:", storeNameInput.value);
    } else {
      console.error("Store name input not found!");
    }

    // Force show step 1 content
    showStep(1);
  }, 100);
});

// Force show specific step
function showStep(stepNumber) {
  console.log(`Forcing display of step ${stepNumber}`);

  // Hide all step content
  const stepContents = $$(".step-content");
  stepContents.forEach((content) => {
    content.classList.remove("active");
    content.style.display = "none";
  });

  // Show current step content
  const currentContent = $(`[data-step="${stepNumber}"]`);
  if (currentContent) {
    currentContent.classList.add("active");
    currentContent.style.display = "block";
    console.log(`Step ${stepNumber} content displayed`);
  } else {
    console.error(`Step ${stepNumber} content not found!`);
  }

  // Update sidebar steps
  const stepItems = $$(".step-item");
  stepItems.forEach((item, index) => {
    item.classList.remove("active", "completed");
    if (index + 1 === stepNumber) {
      item.classList.add("active");
    } else if (index + 1 < stepNumber) {
      item.classList.add("completed");
    }
  });
}

// Load plugin data from JSON
async function loadPluginData() {
  try {
    const response = await fetch("assets/data/plugins-data.json");
    pluginData = await response.json();
    console.log("Plugin data loaded:", pluginData);
    renderPluginSections();
  } catch (error) {
    console.error("Error loading plugin data:", error);
    // Fallback plugin data
    pluginData = {
      payments: {
        title: "Payments",
        description: "Payment processing plugins",
        plugins: [
          {
            id: "ppcp",
            name: "PayPal Complete Payments",
            description: "Full-stack payment solution",
            selected: true,
            needsLicense: false,
          },
        ],
      },
    };
    renderPluginSections();
  }
}

// Initialize event handlers
function initializeEventHandlers() {
  console.log("Initializing event handlers...");

  const nextBtn = $("#nextBtn");
  const prevBtn = $("#prevBtn");
  const storeNameInput = $("#storeName");

  // Navigation buttons
  if (nextBtn) {
    nextBtn.addEventListener("click", function (e) {
      e.preventDefault();
      console.log("Next button clicked!", "Current step:", currentStep);

      if (this.disabled) {
        console.log("Button is disabled, not proceeding");
        return false;
      }

      if (currentStep < 6) {
        console.log("Calling nextStep()");
        nextStep();
      } else {
        console.log("Starting installation");
        startInstallation();
      }
    });
    console.log("Next button handler attached");
  } else {
    console.error("Next button not found!");
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", function (e) {
      e.preventDefault();
      if (currentStep > 1) {
        prevStep();
      }
    });
    console.log("Previous button handler attached");
  } else {
    console.error("Previous button not found!");
  }

  // Store name input
  if (storeNameInput) {
    ["input", "change", "blur"].forEach((eventType) => {
      storeNameInput.addEventListener(eventType, function () {
        const storeName = this.value.trim();
        console.log("Store name input changed to:", storeName);

        wizardData.storeInfo = wizardData.storeInfo || {};
        wizardData.storeInfo.name = storeName;
        saveWizardData();
        updateSummary();
        updateNextButton();
      });
    });
    console.log("Store name input handler attached");
  } else {
    console.error("Store name input not found!");
  }

  // Version selection
  const versionSelect = $("#versionSelect");
  if (versionSelect) {
    versionSelect.addEventListener("change", function () {
      const version = this.value;
      console.log("Version selected:", version);
      wizardData.version = version;
      saveWizardData();

      if (version) {
        showDependencies();
        updateNextButton();
      } else {
        const dependenciesDisplay = $("#dependenciesDisplay");
        if (dependenciesDisplay) {
          dependenciesDisplay.classList.remove("show");
        }
        updateNextButton();
      }
    });
  }

  // Platform selection using event delegation
  delegate(document, ".platform-card", "click", function () {
    const platform = this.dataset.platform;
    console.log("Platform selected:", platform);
    selectPlatform(platform);
  });

  // Theme selection using event delegation
  delegate(document, ".theme-clickable", "click", function () {
    const theme = this.dataset.theme;
    console.log("Theme selected:", theme);
    selectTheme(theme);
  });

  // Sample data selection using event delegation
  delegate(document, ".sample-clickable", "click", function () {
    const sampleType = this.dataset.sample;
    console.log("Sample data selected:", sampleType);
    selectSampleData(sampleType);
  });

  // Plugin toggles using event delegation
  delegate(document, ".plugin-checkbox", "change", function () {
    const pluginId = this.id;
    const isChecked = this.checked;
    console.log("Plugin toggled:", pluginId, isChecked);

    // Check if plugin needs license and is being enabled
    const pluginNeedsLicense = checkIfPluginNeedsLicense(pluginId);

    if (isChecked && pluginNeedsLicense && !wizardData.licenseKeys[pluginId]) {
      // Show license modal immediately
      const pluginName = getPluginName(pluginId);
      openLicenseModal(pluginId, pluginName, true);
      return;
    }

    wizardData.plugins[pluginId] = isChecked;

    // Update plugin item visual state
    const pluginItem = this.closest(".plugin-item");
    if (isChecked) {
      pluginItem.classList.add("selected");
    } else {
      pluginItem.classList.remove("selected");
      // Remove license key if plugin is disabled
      if (wizardData.licenseKeys[pluginId]) {
        delete wizardData.licenseKeys[pluginId];
      }
    }

    saveWizardData();
    updateSummary();
  });

  console.log("All event handlers initialized");
}

// Navigation functions
function nextStep() {
  console.log("nextStep called, current step:", currentStep);
  const isValid = validateCurrentStep();
  console.log("Step validation result:", isValid);

  if (isValid) {
    currentStep++;
    console.log("Advancing to step:", currentStep);
    showStep(currentStep);
    updateProgressBar();
    updateNavigation();
  } else {
    console.log("Validation failed, not advancing");
  }
}

function prevStep() {
  currentStep--;
  console.log("Going back to step:", currentStep);
  showStep(currentStep);
  updateProgressBar();
  updateNavigation();
}

// Validate current step
function validateCurrentStep() {
  let result = false;

  switch (currentStep) {
    case 1:
      // Step 1 should be valid if store name exists and not empty
      const storeName = wizardData.storeInfo?.name;
      result = storeName && storeName.trim().length > 0;
      console.log(
        "Step 1 validation - Store name:",
        storeName,
        "Result:",
        result
      );
      break;
    case 2:
      result = wizardData.platform && wizardData.version;
      console.log(
        "Step 2 validation - Platform:",
        wizardData.platform,
        "Version:",
        wizardData.version,
        "Result:",
        result
      );
      break;
    case 3:
      result = wizardData.theme && wizardData.theme !== "";
      console.log(
        "Step 3 validation - Theme:",
        wizardData.theme,
        "Result:",
        result
      );
      break;
    case 4:
    case 5:
    case 6:
      result = true; // Plugin, sample data, and summary steps are always valid
      break;
    default:
      result = true;
      break;
  }

  console.log(`Final validation result for step ${currentStep}:`, result);
  return result;
}

// Update progress bar
function updateProgressBar() {
  const progress = (currentStep / 6) * 100;
  const progressFill = $(".progress-fill");
  if (progressFill) {
    progressFill.style.width = progress + "%";
  }

  const stepTexts = {
    1: "Step 1 of 6 - Store Info",
    2: "Step 2 of 6 - Platform",
    3: "Step 3 of 6 - Styles",
    4: "Step 4 of 6 - Plugin Settings",
    5: "Step 5 of 6 - Sample Data",
    6: "Step 6 of 6 - Summary",
  };

  const progressText = $(".progress-text");
  if (progressText) {
    progressText.textContent = stepTexts[currentStep];
  }

  const currentStepSpan = $(".current-step");
  if (currentStepSpan) {
    currentStepSpan.textContent = `Step ${currentStep} of 6`;
  }
}

// Update navigation buttons
function updateNavigation() {
  const prevBtn = $("#prevBtn");
  const nextBtn = $("#nextBtn");

  if (prevBtn) {
    prevBtn.disabled = currentStep === 1;
  }

  if (nextBtn) {
    if (currentStep === 6) {
      nextBtn.innerHTML = '<i class="fas fa-rocket"></i> Start Installation';
    } else {
      nextBtn.innerHTML = 'Next Step <i class="fas fa-arrow-right"></i>';
    }
  }

  updateNextButton();
}

// Update next button state
function updateNextButton() {
  const isValid = validateCurrentStep();
  const nextBtn = $("#nextBtn");

  console.log("=== updateNextButton Debug ===");
  console.log("Current Step:", currentStep);
  console.log("Store Name:", wizardData.storeInfo?.name);
  console.log("Is Valid:", isValid);
  console.log("Button element found:", !!nextBtn);

  if (!nextBtn) {
    console.error("Next button not found!");
    return;
  }

  if (isValid) {
    nextBtn.disabled = false;
    nextBtn.classList.remove("disabled");
    nextBtn.style.opacity = "1";
    nextBtn.style.pointerEvents = "auto";
    nextBtn.style.cursor = "pointer";
    console.log("Button enabled");
  } else {
    nextBtn.disabled = true;
    nextBtn.classList.add("disabled");
    nextBtn.style.opacity = "0.5";
    nextBtn.style.pointerEvents = "none";
    nextBtn.style.cursor = "not-allowed";
    console.log("Button disabled");
  }

  console.log("Button final state - disabled:", nextBtn.disabled);
  console.log("=== End Debug ===");
}

// Update display
function updateDisplay() {
  console.log("Updating display for step:", currentStep);
  showStep(currentStep);
  updateProgressBar();
  updateNavigation();
  updateSummary();
}

// Load data from localStorage
function loadWizardData() {
  const savedData = localStorage.getItem("wizardData");

  // Set default store name first
  wizardData.storeInfo = wizardData.storeInfo || {};
  wizardData.storeInfo.name = "Sample Store";

  if (savedData) {
    try {
      const parsed = JSON.parse(savedData);
      wizardData = { ...wizardData, ...parsed };

      // Ensure store name is not empty
      if (
        !wizardData.storeInfo?.name ||
        wizardData.storeInfo.name.trim() === ""
      ) {
        wizardData.storeInfo.name = "Sample Store";
      }

      console.log("Loaded wizard data from localStorage:", wizardData);
    } catch (e) {
      console.error("Error parsing saved data:", e);
      // Reset to default if corrupted
      wizardData.storeInfo.name = "Sample Store";
    }
  } else {
    console.log("No saved data found, using defaults");
  }

  // Save the data to ensure consistency
  saveWizardData();
  populateFormFields();
}

// Save data to localStorage
function saveWizardData() {
  localStorage.setItem("wizardData", JSON.stringify(wizardData));
}

// Update summary function
function updateSummary() {
  const summaryStoreName = $("#summary-store-name");
  const summaryVersion = $("#summary-version");
  const summaryTheme = $("#summary-selected-theme");
  const summarySampleData = $("#summary-sample-data");

  if (summaryStoreName) {
    summaryStoreName.textContent = wizardData.storeInfo?.name || "a";
  }
  if (summaryVersion) {
    summaryVersion.textContent = wizardData.version || "2_4_7";
  }
  if (summaryTheme) {
    summaryTheme.textContent = wizardData.theme || "Luma";
  }
  if (summarySampleData) {
    const sampleDataText =
      wizardData.sampleData === "with_sample"
        ? "Yes, using sample data"
        : "No, using own data";
    summarySampleData.textContent = sampleDataText;
  }

  if (wizardData.styling) {
    // Logo summary
    if (wizardData.styling.logos) {
      const summaryDesktopLogo = $("#summary-desktop-logo");
      const summaryMobileLogo = $("#summary-mobile-logo");

      if (summaryDesktopLogo) {
        summaryDesktopLogo.textContent = wizardData.styling.logos.desktop
          ? "Desktop logo uploaded"
          : "No desktop logo uploaded";
      }
      if (summaryMobileLogo) {
        summaryMobileLogo.textContent = wizardData.styling.logos.mobile
          ? "Mobile logo uploaded"
          : "No mobile logo uploaded";
      }
    }

    // Color summary
    if (wizardData.styling.colors) {
      const summaryPrimaryColor = $("#summary-primary-color");
      const summarySecondaryColor = $("#summary-secondary-color");
      const summaryTertiaryColor = $("#summary-tertiary-color");

      if (summaryPrimaryColor) {
        summaryPrimaryColor.textContent =
          wizardData.styling.colors.primary || "#4e54c8";
      }
      if (summarySecondaryColor) {
        summarySecondaryColor.textContent =
          wizardData.styling.colors.secondary || "#8f94fb";
      }
      if (summaryTertiaryColor) {
        summaryTertiaryColor.textContent =
          wizardData.styling.colors.tertiary || "#19b78a";
      }
    }

    // Font summary
    const summaryFonts = $("#summary-fonts");
    if (summaryFonts) {
      if (wizardData.styling.useDefaultFont) {
        summaryFonts.textContent = "Using Default Theme Font";
      } else {
        summaryFonts.textContent = wizardData.styling.fonts || "Custom Font";
      }
    }
  }
}

// Platform selection
function selectPlatform(platform) {
  console.log("Selecting platform:", platform);

  // Remove selected class from all platform cards
  $$(".platform-card").forEach((card) => card.classList.remove("selected"));

  // Add selected class to clicked platform
  const selectedCard = $(`.platform-card[data-platform="${platform}"]`);
  if (selectedCard) {
    selectedCard.classList.add("selected");
  }

  wizardData.platform = platform;
  saveWizardData();

  populateVersionSelect();
  const versionSection = $("#versionSection");
  if (versionSection) {
    versionSection.classList.add("show");
  }

  updateThemeGrid();
  updateNextButton();
}

// Theme selection functions
function selectTheme(themeName) {
  console.log("Selecting theme:", themeName);
  wizardData.theme = themeName;

  // Update visual state
  $$(".theme-item").forEach((item) => item.classList.remove("selected"));

  const selectedTheme = $(`[data-theme="${themeName}"]`);
  if (selectedTheme) {
    selectedTheme.classList.add("selected");
  }

  saveWizardData();
  updateSummary();
  updateNextButton();
}

// Sample data selection
function selectSampleData(sampleType) {
  console.log("Selecting sample data:", sampleType);
  wizardData.sampleData = sampleType;

  // Update visual state
  $$(".sample-item").forEach((item) => item.classList.remove("selected"));

  const selectedSample = $(`[data-sample="${sampleType}"]`);
  if (selectedSample) {
    selectedSample.classList.add("selected");
  }

  saveWizardData();
  updateSummary();
}

// Helper functions
function populateFormFields() {
  console.log("Populating form fields...");

  // Store info
  if (wizardData.storeInfo) {
    const storeNameInput = $("#storeName");
    if (storeNameInput) {
      storeNameInput.value = wizardData.storeInfo.name || "Sample Store";
      console.log("Store name populated:", storeNameInput.value);
    }
  }

  // Platform selection
  if (wizardData.platform) {
    selectPlatform(wizardData.platform);
    updateThemeGrid();
  }

  // Theme selection
  if (wizardData.theme) {
    selectTheme(wizardData.theme);
  }

  // Sample data
  if (wizardData.sampleData) {
    selectSampleData(wizardData.sampleData);
  }

  // Update plugin states after rendering
  setTimeout(() => {
    if (wizardData.plugins) {
      Object.entries(wizardData.plugins).forEach(([pluginId, isEnabled]) => {
        const checkbox = $("#" + pluginId);
        if (checkbox) {
          checkbox.checked = isEnabled;
          if (isEnabled) {
            const pluginItem = checkbox.closest(".plugin-item");
            if (pluginItem) {
              pluginItem.classList.add("selected");
            }
          }
        }
      });
    }

    // Force validation update after everything is loaded
    updateNextButton();
  }, 100);
}

function populateVersionSelect() {
  const select = $("#versionSelect");
  if (!select) {
    console.error("Version select not found!");
    return;
  }

  select.innerHTML = '<option value="">Choose version...</option>';

  if (wizardData.platform && platformData[wizardData.platform]) {
    const versions = Object.keys(platformData[wizardData.platform].versions);
    versions.forEach((version) => {
      const option = document.createElement("option");
      option.value = version;
      option.textContent = version;
      if (version === wizardData.version) {
        option.selected = true;
      }
      select.appendChild(option);
    });
    console.log("Version select populated with", versions.length, "versions");
  }
}

function updateThemeGrid() {
  const defaultThemes = $$(".default-themes");
  const magentoThemes = $$(".magento-themes");

  if (wizardData.platform === "magento") {
    defaultThemes.forEach((theme) => (theme.style.display = "none"));
    magentoThemes.forEach((theme) => (theme.style.display = "block"));

    // Set default theme for Magento if none selected
    if (!wizardData.theme) {
      selectTheme("luma");
    }
  } else {
    defaultThemes.forEach((theme) => (theme.style.display = "block"));
    magentoThemes.forEach((theme) => (theme.style.display = "none"));

    // Set default theme for other platforms if none selected
    if (
      !wizardData.theme ||
      wizardData.theme === "luma" ||
      wizardData.theme === "hyva"
    ) {
      selectTheme("default");
    }
  }

  // Update visual selection
  setTimeout(() => {
    if (wizardData.theme) {
      const selectedTheme = $(`[data-theme="${wizardData.theme}"]`);
      if (selectedTheme) {
        selectedTheme.classList.add("selected");
      }
    }
  }, 100);

  saveWizardData();
  updateNextButton();
}

function renderPluginSections() {
  const container = $("#pluginSections");
  if (!container) {
    console.error("Plugin sections container not found!");
    return;
  }

  container.innerHTML = "";

  Object.entries(pluginData).forEach(([sectionKey, section]) => {
    const sectionDiv = document.createElement("div");
    sectionDiv.className = "plugin-section";

    const pluginsHtml = section.plugins
      .map(
        (plugin) => `
      <div class="plugin-item ${
        plugin.selected ? "selected" : ""
      }" data-plugin="${plugin.id}">
        <div class="plugin-info">
          <h4 class="plugin-name">${plugin.name}</h4>
          <p class="plugin-description">${plugin.description}</p>
          ${
            plugin.needsLicense
              ? '<p class="plugin-license-text">Requires license key</p>'
              : ""
          }
        </div>
        <div class="plugin-controls">
          <div class="plugin-toggle">
            <input type="checkbox" id="${plugin.id}" class="plugin-checkbox" ${
          plugin.selected ? "checked" : ""
        }>
            <label for="${plugin.id}" class="toggle-switch"></label>
          </div>
        </div>
      </div>
    `
      )
      .join("");

    sectionDiv.innerHTML = `
      <h3 class="plugin-section-title">${section.title}</h3>
      <p class="plugin-section-description">${section.description}</p>
      <div class="plugin-list">
        ${pluginsHtml}
      </div>
    `;

    container.appendChild(sectionDiv);
  });

  console.log("Plugin sections rendered");
}

function checkIfPluginNeedsLicense(pluginId) {
  for (const section of Object.values(pluginData)) {
    const plugin = section.plugins.find((p) => p.id === pluginId);
    if (plugin) {
      return plugin.needsLicense;
    }
  }
  return false;
}

function getPluginName(pluginId) {
  for (const section of Object.values(pluginData)) {
    const plugin = section.plugins.find((p) => p.id === pluginId);
    if (plugin) {
      return plugin.name;
    }
  }
  return pluginId;
}

function showDependencies() {
  if (wizardData.platform && wizardData.version) {
    const dependencies =
      platformData[wizardData.platform].versions[wizardData.version];
    const container = $("#dependenciesList");
    if (!container) return;

    container.innerHTML = "";

    Object.entries(dependencies).forEach(([dep, version]) => {
      if (version !== "N/A") {
        const iconClass = dependencyIcons[dep] || "fas fa-cog";
        const depItem = document.createElement("div");
        depItem.className = "dependency-item";
        depItem.innerHTML = `
          <div class="dependency-icon ${dep}">
            <i class="${iconClass}"></i>
          </div>
          <div class="dependency-details">
            <div class="dependency-name">${dep.toUpperCase()}</div>
            <div class="dependency-version">v${version}</div>
          </div>
        `;
        container.appendChild(depItem);
      }
    });

    const dependenciesDisplay = $("#dependenciesDisplay");
    if (dependenciesDisplay) {
      dependenciesDisplay.classList.add("show");
    }
  }
}

// Color functions
function updateColor(colorType) {
  const picker = $("#" + colorType + "ColorPicker");
  const value = $("#" + colorType + "ColorValue");

  if (picker && value) {
    value.value = picker.value;
    saveColorToWizardData(colorType, picker.value);
    updateColorGuide();
  }
}

function updateColorFromText(colorType) {
  const picker = $("#" + colorType + "ColorPicker");
  const value = $("#" + colorType + "ColorValue");

  if (picker && value && /^#[0-9A-F]{6}$/i.test(value.value)) {
    picker.value = value.value;
    saveColorToWizardData(colorType, value.value);
    updateColorGuide();
  }
}

function saveColorToWizardData(colorType, colorValue) {
  wizardData.styling = wizardData.styling || {};
  wizardData.styling.colors = wizardData.styling.colors || {};
  wizardData.styling.colors[colorType] = colorValue;

  saveWizardData();
  updateSummary();
}

function updateColorGuide() {
  const primaryColorPicker = $("#primaryColorPicker");
  const secondaryColorPicker = $("#secondaryColorPicker");
  const tertiaryColorPicker = $("#tertiaryColorPicker");

  const primaryDemo = $(".primary-demo");
  const secondaryDemo = $(".secondary-demo");
  const tertiaryDemo = $(".tertiary-demo");

  if (primaryDemo && primaryColorPicker) {
    primaryDemo.style.backgroundColor = primaryColorPicker.value;
  }
  if (secondaryDemo && secondaryColorPicker) {
    secondaryDemo.style.backgroundColor = secondaryColorPicker.value;
  }
  if (tertiaryDemo && tertiaryColorPicker) {
    tertiaryDemo.style.backgroundColor = tertiaryColorPicker.value;
  }
}

// Font functions
function toggleFontSelection() {
  const useDefault = $("#useDefaultFont");
  const customSelection = $("#customFontSelection");

  if (useDefault && customSelection) {
    const isDefaultChecked = useDefault.checked;

    if (isDefaultChecked) {
      customSelection.style.display = "none";
      wizardData.styling.useDefaultFont = true;
      wizardData.styling.fonts = "default";

      // Reset preview to default
      const fontPreviewText = $("#fontPreviewText");
      if (fontPreviewText) {
        fontPreviewText.style.fontFamily = "Montserrat";
      }
    } else {
      customSelection.style.display = "block";
      wizardData.styling.useDefaultFont = false;
    }

    saveWizardData();
    updateSummary();
  }
}

function updateCustomFont() {
  const fontInput = $("#fontSearchInput");
  const fontPreviewText = $("#fontPreviewText");

  if (fontInput && fontPreviewText) {
    const fontName = fontInput.value.trim();

    if (fontName) {
      wizardData.styling.fonts = fontName;
      fontPreviewText.style.fontFamily = fontName;
      saveWizardData();
      updateSummary();
    }
  }
}

// Logo upload functions
function handleLogoUpload(input, type) {
  const file = input.files[0];
  if (!file) return;

  if (file.size > 2 * 1024 * 1024) {
    alert("File size must be less than 2MB");
    return;
  }

  if (!file.type.match(/^image\/(png|jpg|jpeg|svg\+xml)$/)) {
    alert("Please upload a valid image file (PNG, JPG, SVG)");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const previewId =
      type === "desktop" ? "desktopLogoPreview" : "mobileLogoPreview";
    const imageId = type === "desktop" ? "desktopLogoImage" : "mobileLogoImage";

    const preview = $("#" + previewId);
    const image = $("#" + imageId);

    if (image && preview) {
      image.src = e.target.result;
      preview.style.display = "block";

      // Save to wizard data
      wizardData.styling = wizardData.styling || {};
      wizardData.styling.logos = wizardData.styling.logos || {};
      wizardData.styling.logos[type] = e.target.result;

      saveWizardData();
      updateSummary();
    }
  };
  reader.readAsDataURL(file);
}

// Style tab functions
function switchStyleTab(tabName) {
  console.log("Switching to style tab:", tabName);

  // Update tab buttons
  const tabButtons = $(".style-tabs .tab-button");
  tabButtons.forEach((btn) => btn.classList.remove("active"));

  const activeTabBtn = $(`[data-tab="${tabName}"]`);
  if (activeTabBtn) {
    activeTabBtn.classList.add("active");
  }

  // Update tab content
  const tabPanels = $(".style-tabs .tab-panel");
  tabPanels.forEach((panel) => panel.classList.remove("active"));

  const activePanel = $(`.style-tabs .tab-panel[data-tab="${tabName}"]`);
  if (activePanel) {
    activePanel.classList.add("active");
  }
}

// Theme preview functions
function openThemePreview(themeName) {
  const modal = $("#themePreviewModal");
  const modalTitle = $("#modalThemeTitle");
  const desktopPreview = $("#desktopPreview");
  const mobilePreview = $("#mobilePreview");

  const themeData = themePreviewData[themeName];
  if (themeData && modal && modalTitle && desktopPreview && mobilePreview) {
    modalTitle.textContent = themeData.name + " Preview";
    desktopPreview.src = themeData.desktop;
    mobilePreview.src = themeData.mobile;

    modal.classList.add("show");
    document.body.classList.add("modal-open");
  }
}

function closeThemePreview() {
  const modal = $("#themePreviewModal");
  if (modal) {
    modal.classList.remove("show");
    document.body.classList.remove("modal-open");
  }

  // Reset to preview tab
  const tabButtons = $(".theme-tab-btn");
  tabButtons.forEach((btn) => btn.classList.remove("active"));

  const previewTabBtn = $('.theme-tab-btn[onclick*="preview"]');
  if (previewTabBtn) {
    previewTabBtn.classList.add("active");
  }

  const tabContents = $(".theme-tab-content");
  tabContents.forEach((content) => content.classList.remove("active"));

  const previewTab = $("#previewTab");
  if (previewTab) {
    previewTab.classList.add("active");
  }
}

function switchThemeTab(tabName) {
  const tabButtons = $(".theme-tab-btn");
  tabButtons.forEach((btn) => btn.classList.remove("active"));

  // Find the clicked button and activate it
  const clickedBtn = event.target.closest(".theme-tab-btn");
  if (clickedBtn) {
    clickedBtn.classList.add("active");
  }

  const tabContents = $(".theme-tab-content");
  tabContents.forEach((content) => content.classList.remove("active"));

  if (tabName === "preview") {
    const previewTab = $("#previewTab");
    if (previewTab) {
      previewTab.classList.add("active");
    }
  } else if (tabName === "styling") {
    const stylingTab = $("#stylingTab");
    if (stylingTab) {
      stylingTab.classList.add("active");
    }
  }
}

function getSelectedTheme() {
  return wizardData.theme || "luma";
}

// License modal functions
function openLicenseModal(pluginId, pluginName, isRequired = false) {
  currentLicensePlugin = pluginId;

  const modal = $("#licenseModal");
  const modalTitle = $("#licenseModalTitle");
  const licenseKeyInput = $("#licenseKeyInput");

  if (modal && modalTitle && licenseKeyInput) {
    modalTitle.textContent = `Enter License Key for ${pluginName}`;
    licenseKeyInput.value = wizardData.licenseKeys[pluginId] || "";

    if (isRequired) {
      licenseKeyInput.setAttribute("required", "true");
    }

    modal.classList.add("show");
    document.body.classList.add("modal-open");
  }
}

function closeLicenseModal() {
  const licenseKeyInput = $("#licenseKeyInput");
  const isRequired =
    licenseKeyInput && licenseKeyInput.hasAttribute("required");

  if (isRequired && currentLicensePlugin) {
    // If license is required and modal is closed without saving, uncheck the plugin
    const checkbox = $("#" + currentLicensePlugin);
    if (checkbox) {
      checkbox.checked = false;
      const pluginItem = checkbox.closest(".plugin-item");
      if (pluginItem) {
        pluginItem.classList.remove("selected");
      }
      delete wizardData.plugins[currentLicensePlugin];
      saveWizardData();
    }
  }

  const modal = $("#licenseModal");
  if (modal) {
    modal.classList.remove("show");
    document.body.classList.remove("modal-open");
  }

  currentLicensePlugin = null;
  if (licenseKeyInput) {
    licenseKeyInput.removeAttribute("required");
  }
}

function saveLicenseKey() {
  const licenseKeyInput = $("#licenseKeyInput");

  if (!licenseKeyInput) return;

  const licenseKey = licenseKeyInput.value.trim();

  if (!licenseKey) {
    alert("Please enter a license key");
    return;
  }

  if (currentLicensePlugin) {
    wizardData.licenseKeys[currentLicensePlugin] = licenseKey;
    wizardData.plugins[currentLicensePlugin] = true;

    // Update plugin visual state
    const checkbox = $("#" + currentLicensePlugin);
    if (checkbox) {
      checkbox.checked = true;
      const pluginItem = checkbox.closest(".plugin-item");
      if (pluginItem) {
        pluginItem.classList.add("selected");
      }
    }

    saveWizardData();
    updateSummary();
    closeLicenseModal();
  }
}

// Start installation
function startInstallation() {
  const installationModal = $("#installationModal");
  if (installationModal) {
    installationModal.classList.add("show");
    document.body.classList.add("modal-open");
  }

  const steps = [
    { id: "downloadStep", delay: 1000 },
    { id: "databaseStep", delay: 3000 },
    { id: "configStep", delay: 5000 },
    { id: "completeStep", delay: 7000 },
  ];

  steps.forEach((step, index) => {
    setTimeout(() => {
      // Complete previous step
      if (index > 0) {
        const prevStep = $("#" + steps[index - 1].id);
        if (prevStep) {
          prevStep.classList.remove("active");
          prevStep.classList.add("completed");
          const prevIcon = prevStep.querySelector(".install-status i");
          if (prevIcon) {
            prevIcon.classList.remove("fa-spinner", "fa-spin");
            prevIcon.classList.add("fa-check");
          }
        }
      }

      // Activate current step
      const currentStepEl = $("#" + step.id);
      if (currentStepEl) {
        currentStepEl.classList.add("active");
        const currentIcon = currentStepEl.querySelector(".install-status i");
        if (currentIcon) {
          currentIcon.classList.remove("fa-clock");
          currentIcon.classList.add("fa-spinner", "fa-spin");
        }

        // Complete last step and show completion
        if (index === steps.length - 1) {
          setTimeout(() => {
            currentStepEl.classList.remove("active");
            currentStepEl.classList.add("completed");
            if (currentIcon) {
              currentIcon.classList.remove("fa-spinner", "fa-spin");
              currentIcon.classList.add("fa-check");
            }

            // Hide installation steps and show completion
            const installationSteps = $(".installation-steps");
            const installationComplete = $("#installationComplete");
            if (installationSteps) installationSteps.style.display = "none";
            if (installationComplete)
              installationComplete.style.display = "block";
          }, 2000);
        }
      }
    }, step.delay);
  });
}

// View website function
function viewWebsite() {
  const storeName = wizardData.storeInfo?.name || "Your Website";
  alert(`Opening ${storeName}...`);

  // Reset wizard for demo
  if (confirm("Would you like to create another website?")) {
    resetWizard();
  } else {
    const installationModal = $("#installationModal");
    if (installationModal) {
      installationModal.classList.remove("show");
      document.body.classList.remove("modal-open");
    }
  }
}

// Reset wizard
function resetWizard() {
  localStorage.removeItem("wizardData");
  location.reload();
}

// Close modal when clicking outside
document.addEventListener("click", function (event) {
  const themeModal = $("#themePreviewModal");
  const licenseModal = $("#licenseModal");

  if (event.target === themeModal) {
    closeThemePreview();
  }
});

// Close modal with Escape key
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closeThemePreview();
    closeLicenseModal();
  }
});

// Make functions global for onclick handlers
window.openThemePreview = openThemePreview;
window.closeThemePreview = closeThemePreview;
window.switchThemeTab = switchThemeTab;
window.handleLogoUpload = handleLogoUpload;
window.closeSuccessMessage = function () {
  /* placeholder */
};
window.openLicenseModal = openLicenseModal;
window.closeLicenseModal = closeLicenseModal;
window.saveLicenseKey = saveLicenseKey;
window.switchStyleTab = switchStyleTab;
window.getSelectedTheme = getSelectedTheme;
window.updateColor = updateColor;
window.updateColorFromText = updateColorFromText;
window.selectTheme = selectTheme;
window.selectSampleData = selectSampleData;
window.toggleFontSelection = toggleFontSelection;
window.updateCustomFont = updateCustomFont;
window.viewWebsite = viewWebsite;
window.selectPlatform = selectPlatform;
