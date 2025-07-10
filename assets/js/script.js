// Update color functions to include tertiary
function updateColor(colorType) {
  const picker = document.getElementById(`${colorType}ColorPicker`);
  const value = document.getElementById(`${colorType}ColorValue`);

  value.value = picker.value;
  saveColorToWizardData(colorType, picker.value);
  updateColorGuide();
}

function updateColorFromText(colorType) {
  const picker = document.getElementById(`${colorType}ColorPicker`);
  const value = document.getElementById(`${colorType}ColorValue`);

  if (/^#[0-9A-F]{6}$/i.test(value.value)) {
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
  // Update color guide swatches
  const primaryColor = document.getElementById("primaryColorPicker").value;
  const secondaryColor = document.getElementById("secondaryColorPicker").value;
  const tertiaryColor = document.getElementById("tertiaryColorPicker").value;

  if (document.querySelector(".primary-demo")) {
    document.querySelector(".primary-demo").style.backgroundColor =
      primaryColor;
  }
  if (document.querySelector(".secondary-demo")) {
    document.querySelector(".secondary-demo").style.backgroundColor =
      secondaryColor;
  }
  if (document.querySelector(".tertiary-demo")) {
    document.querySelector(".tertiary-demo").style.backgroundColor =
      tertiaryColor;
  }
}

// Start installation with modal
function startInstallation() {
  $("#installationModal").addClass("show");
  $("body").addClass("modal-open");

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
        const prevStep = $(`#${steps[index - 1].id}`);
        prevStep.removeClass("active").addClass("completed");
        prevStep
          .find(".install-status i")
          .removeClass("fa-spinner fa-spin")
          .addClass("fa-check");
      }

      // Activate current step
      const currentStepEl = $(`#${step.id}`);
      currentStepEl.addClass("active");
      currentStepEl
        .find(".install-status i")
        .removeClass("fa-clock")
        .addClass("fa-spinner fa-spin");

      // Complete last step and show completion
      if (index === steps.length - 1) {
        setTimeout(() => {
          currentStepEl.removeClass("active").addClass("completed");
          currentStepEl
            .find(".install-status i")
            .removeClass("fa-spinner fa-spin")
            .addClass("fa-check");

          // Hide installation steps and show completion
          $(".installation-steps").hide();
          $("#installationComplete").show();
        }, 2000);
      }
    }, step.delay);
  });
}

// View website function
function viewWebsite() {
  const storeName = wizardData.storeInfo?.name || "Your Website";
  alert(`Opening ${storeName}...`);
  // Here you would normally redirect to the actual website
  // window.open('https://yourwebsite.com', '_blank');

  // Reset wizard for demo
  if (confirm("Would you like to create another website?")) {
    resetWizard();
  } else {
    $("#installationModal").removeClass("show");
    $("body").removeClass("modal-open");
  }
}

// Update summary function
function updateSummary() {
  $("#summary-store-name").text(wizardData.storeInfo?.name || "a");
  $("#summary-version").text(wizardData.version || "2_4_7");
  $("#summary-selected-theme").text(wizardData.theme || "Luma");

  // Sample data summary
  const sampleDataText =
    wizardData.sampleData === "with_sample"
      ? "Yes, using sample data"
      : "No, using own data";
  $("#summary-sample-data").text(sampleDataText);

  if (wizardData.styling) {
    // Logo summary
    if (wizardData.styling.logos) {
      $("#summary-desktop-logo").text(
        wizardData.styling.logos.desktop
          ? "Desktop logo uploaded"
          : "No desktop logo uploaded"
      );
      $("#summary-mobile-logo").text(
        wizardData.styling.logos.mobile
          ? "Mobile logo uploaded"
          : "No mobile logo uploaded"
      );
    }

    // Color summary
    if (wizardData.styling.colors) {
      $("#summary-primary-color").text(
        wizardData.styling.colors.primary || "#4e54c8"
      );
      $("#summary-secondary-color").text(
        wizardData.styling.colors.secondary || "#8f94fb"
      );
      $("#summary-tertiary-color").text(
        wizardData.styling.colors.tertiary || "#19b78a"
      );
    }

    // Font summary
    if (wizardData.styling.useDefaultFont) {
      $("#summary-fonts").text("Using Default Theme Font");
    } else {
      $("#summary-fonts").text(wizardData.styling.fonts || "Custom Font");
    }
  }
}

// Update theme grid based on selected platform
function updateThemeGrid() {
  if (wizardData.platform === "magento") {
    $(".default-themes").hide();
    $(".magento-themes").show();

    // Set default theme for Magento if none selected
    if (!wizardData.theme) {
      selectTheme("luma");
    }
  } else {
    $(".default-themes").show();
    $(".magento-themes").hide();

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
      document
        .querySelector(`[data-theme="${wizardData.theme}"]`)
        .classList.add("selected");
    }
  }, 100);

  saveWizardData();
  updateNextButton();
}

// Populate form fields from saved data
function populateFormFields() {
  // Store info
  if (wizardData.storeInfo) {
    const storeName = wizardData.storeInfo.name || "Sample Store";
    $("#storeName").val(storeName);

    // Ensure wizardData is updated with current value
    wizardData.storeInfo.name = storeName;
    saveWizardData();
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

  // Colors
  if (wizardData.styling && wizardData.styling.colors) {
    const colors = wizardData.styling.colors;
    if (colors.primary) {
      $("#primaryColorPicker").val(colors.primary);
      $("#primaryColorValue").val(colors.primary);
    }
    if (colors.secondary) {
      $("#secondaryColorPicker").val(colors.secondary);
      $("#secondaryColorValue").val(colors.secondary);
    }
    if (colors.tertiary) {
      $("#tertiaryColorPicker").val(colors.tertiary);
      $("#tertiaryColorValue").val(colors.tertiary);
    }
    updateColorGuide();
  }

  // Fonts
  if (wizardData.styling) {
    if (wizardData.styling.useDefaultFont !== undefined) {
      $("#useDefaultFont").prop("checked", wizardData.styling.useDefaultFont);
      toggleFontSelection();
    }
    if (!wizardData.styling.useDefaultFont && wizardData.styling.fonts) {
      $("#fontSearchInput").val(wizardData.styling.fonts);
      updateCustomFont();
    }
  }

  // Logos
  if (wizardData.styling && wizardData.styling.logos) {
    if (wizardData.styling.logos.desktop) {
      $("#desktopLogoImage").attr("src", wizardData.styling.logos.desktop);
      $("#desktopLogoPreview").show();
    }
    if (wizardData.styling.logos.mobile) {
      $("#mobileLogoImage").attr("src", wizardData.styling.logos.mobile);
      $("#mobileLogoPreview").show();
    }
  }

  // Update plugin states after rendering
  setTimeout(() => {
    if (wizardData.plugins) {
      Object.entries(wizardData.plugins).forEach(([pluginId, isEnabled]) => {
        const checkbox = $(`#${pluginId}`);
        if (checkbox.length) {
          checkbox.prop("checked", isEnabled);
          if (isEnabled) {
            checkbox.closest(".plugin-item").addClass("selected");
          }
        }
      });
    }

    // Force validation update after everything is loaded
    updateNextButton();
  }, 100);
}

// Update navigation buttons
function updateNavigation() {
  $("#prevBtn").prop("disabled", currentStep === 1);

  if (currentStep === 6) {
    $("#nextBtn").html('<i class="fas fa-rocket"></i> Start Installation');
  } else {
    $("#nextBtn").html('Next Step <i class="fas fa-arrow-right"></i>');
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
  console.log("Button element found:", nextBtn.length > 0);

  if (nextBtn.length === 0) {
    console.error("Next button not found!");
    return;
  }

  if (isValid) {
    nextBtn.prop("disabled", false);
    nextBtn.removeClass("disabled");
    nextBtn.css({
      opacity: "1",
      "pointer-events": "auto",
      cursor: "pointer"
    });
    console.log("Button enabled");
  } else {
    nextBtn.prop("disabled", true);
    nextBtn.addClass("disabled");
    nextBtn.css({
      opacity: "0.5",
      "pointer-events": "none",
      cursor: "not-allowed"
    });
    console.log("Button disabled");
  }

  console.log("Button final state - disabled:", nextBtn.prop("disabled"));
  console.log("=== End Debug ===");
}

// Make functions global for onclick handlers
window.openThemePreview = openThemePreview;
window.closeThemePreview = closeThemePreview;
window.switchThemeTab = switchThemeTab;
window.handleLogoUpload = handleLogoUpload;
window.updateColorValue = updateColorValue;
window.updateColorPicker = updateColorPicker;
window.updateFontPreview = updateFontPreview;
window.closeSuccessMessage = closeSuccessMessage;
window.openLicenseModal = openLicenseModal;
window.closeLicenseModal = closeLicenseModal;
window.saveLicenseKey = saveLicenseKey;
window.switchStyleTab = switchStyleTab;
window.getSelectedTheme = getSelectedTheme;
window.updateColor = updateColor;
window.updateColorFromText = updateColorFromText;
window.updateFontFamily = updateFontFamily;
window.selectTheme = selectTheme;
window.selectSampleData = selectSampleData;
window.toggleFontSelection = toggleFontSelection;
window.updateCustomFont = updateCustomFont;
window.viewWebsite = viewWebsite; // Enhanced Website Creation Wizard JavaScript - 6 Steps
// Vanilla JavaScript implementation for better compatibility

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
    },
  },
};

// Utility functions for DOM manipulation
function $(selector) {
  if (selector.startsWith('#')) {
    return document.getElementById(selector.slice(1));
  }
  return document.querySelector(selector);
}

function $$(selector) {
  return document.querySelectorAll(selector);
}

// Event delegation helper
function delegate(parent, selector, event, handler) {
  parent.addEventListener(event, function(e) {
    if (e.target.matches(selector) || e.target.closest(selector)) {
      handler.call(e.target.closest(selector) || e.target, e);
    }
  });
}

// Initialize wizard when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  console.log("DOM Ready - Initializing wizard...");
  
  // Set default values first
  wizardData.storeInfo = wizardData.storeInfo || {};
  wizardData.storeInfo.name = "Sample Store";

  loadPluginData();
  loadWizardData();
  initializeEventHandlers();
  updateDisplay();

  // Force populate store name field
  const storeNameInput = $('#storeName');
  if (storeNameInput) {
    storeNameInput.value = wizardData.storeInfo.name;
  }
});

// Load plugin data from JSON
async function loadPluginData() {
  try {
    const response = await fetch("assets/data/plugins-data.json");
    pluginData = await response.json();
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
  const nextBtn = $('#nextBtn');
  const prevBtn = $('#prevBtn');
  const storeNameInput = $('#storeName');
  
  // Navigation buttons
  if (nextBtn) {
    nextBtn.addEventListener('click', function() {
      console.log("Next button clicked!");
      
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
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', function() {
      if (currentStep > 1) {
        prevStep();
      }
    });
  }

  // Store name input
  if (storeNameInput) {
    ['input', 'change', 'blur'].forEach(eventType => {
      storeNameInput.addEventListener(eventType, function() {
        const storeName = this.value.trim();
        console.log("Store name input changed to:", storeName);

        wizardData.storeInfo = wizardData.storeInfo || {};
        wizardData.storeInfo.name = storeName;
        saveWizardData();
        updateSummary();
        updateNextButton();
      });
    });
  }

  // Platform selection
  delegate(document, '.platform-card', 'click', function() {
    const platform = this.dataset.platform;
    selectPlatform(platform);
  });

  // Theme selection
  delegate(document, '.theme-clickable', 'click', function() {
    const theme = this.dataset.theme;
    selectTheme(theme);
  });

  // Sample data selection
  delegate(document, '.sample-clickable', 'click', function() {
    const sampleType = this.dataset.sample;
    selectSampleData(sampleType);
  });

  // Plugin toggles
  delegate(document, '.plugin-checkbox', 'change', function() {
    const pluginId = this.id;
    const isChecked = this.checked;

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
    const pluginItem = this.closest('.plugin-item');
    if (isChecked) {
      pluginItem.classList.add('selected');
    } else {
      pluginItem.classList.remove('selected');
      // Remove license key if plugin is disabled
      if (wizardData.licenseKeys[pluginId]) {
        delete wizardData.licenseKeys[pluginId];
      }
    }

    saveWizardData();
    updateSummary();
  });
}

// Navigation functions
function nextStep() {
  console.log("nextStep called, current step:", currentStep);
  const isValid = validateCurrentStep();
  console.log("Step validation result:", isValid);
  
  if (isValid) {
    currentStep++;
    console.log("Advancing to step:", currentStep);
    updateStepDisplay();
    updateProgressBar();
    updateNavigation();
  } else {
    console.log("Validation failed, not advancing");
  }
}

function prevStep() {
  currentStep--;
  updateStepDisplay();
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
      console.log("Step 1 validation - Store name:", storeName, "Result:", result);
      break;
    case 2:
      result = wizardData.platform && wizardData.version;
      console.log("Step 2 validation - Platform:", wizardData.platform, "Version:", wizardData.version, "Result:", result);
      break;
    case 3:
      result = wizardData.theme && wizardData.theme !== "";
      console.log("Step 3 validation - Theme:", wizardData.theme, "Result:", result);
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

// Update step display
function updateStepDisplay() {
  // Hide all step content
  const stepContents = $$('.step-content');
  stepContents.forEach(content => content.classList.remove('active'));
  
  // Show current step content
  const currentContent = $(`[data-step="${currentStep}"]`);
  if (currentContent) {
    currentContent.classList.add('active');
  }
  
  // Update sidebar steps
  const stepItems = $$('.step-item');
  stepItems.forEach((item, index) => {
    item.classList.remove('active', 'completed');
    if (index + 1 === currentStep) {
      item.classList.add('active');
    } else if (index + 1 < currentStep) {
      item.classList.add('completed');
    }
  });
}

// Update progress bar
function updateProgressBar() {
  const progress = (currentStep / 6) * 100;
  const progressFill = $('.progress-fill');
  if (progressFill) {
    progressFill.style.width = progress + '%';
  }
  
  const stepTexts = {
    1: "Step 1 of 6 - Store Info",
    2: "Step 2 of 6 - Platform",
    3: "Step 3 of 6 - Styles",
    4: "Step 4 of 6 - Plugin Settings",
    5: "Step 5 of 6 - Sample Data",
    6: "Step 6 of 6 - Summary",
  };
  
  const progressText = $('.progress-text');
  if (progressText) {
    progressText.textContent = stepTexts[currentStep];
  }
  
  const currentStepSpan = $('.current-step');
  if (currentStepSpan) {
    currentStepSpan.textContent = `Step ${currentStep} of 6`;
  }
}

// Update navigation buttons
function updateNavigation() {
  const prevBtn = $('#prevBtn');
  const nextBtn = $('#nextBtn');
  
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
  const nextBtn = $('#nextBtn');

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
    nextBtn.classList.remove('disabled');
    nextBtn.style.opacity = '1';
    nextBtn.style.pointerEvents = 'auto';
    nextBtn.style.cursor = 'pointer';
    console.log("Button enabled");
  } else {
    nextBtn.disabled = true;
    nextBtn.classList.add('disabled');
    nextBtn.style.opacity = '0.5';
    nextBtn.style.pointerEvents = 'none';
    nextBtn.style.cursor = 'not-allowed';
    console.log("Button disabled");
  }

  console.log("Button final state - disabled:", nextBtn.disabled);
  console.log("=== End Debug ===");
}

// Update display
function updateDisplay() {
  updateStepDisplay();
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
      if (!wizardData.storeInfo?.name || wizardData.storeInfo.name.trim() === "") {
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
  const summaryStoreName = $('#summary-store-name');
  const summaryVersion = $('#summary-version');
  const summaryTheme = $('#summary-selected-theme');
  const summarySampleData = $('#summary-sample-data');

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
    const sampleDataText = wizardData.sampleData === "with_sample"
      ? "Yes, using sample data"
      : "No, using own data";
    summarySampleData.textContent = sampleDataText;
  }

  if (wizardData.styling) {
    // Logo summary
    if (wizardData.styling.logos) {
      const summaryDesktopLogo = $('#summary-desktop-logo');
      const summaryMobileLogo = $('#summary-mobile-logo');
      
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
      const summaryPrimaryColor = $('#summary-primary-color');
      const summarySecondaryColor = $('#summary-secondary-color');
      const summaryTertiaryColor = $('#summary-tertiary-color');
      
      if (summaryPrimaryColor) {
        summaryPrimaryColor.textContent = wizardData.styling.colors.primary || "#4e54c8";
      }
      if (summarySecondaryColor) {
        summarySecondaryColor.textContent = wizardData.styling.colors.secondary || "#8f94fb";
      }
      if (summaryTertiaryColor) {
        summaryTertiaryColor.textContent = wizardData.styling.colors.tertiary || "#19b78a";
      }
    }

    // Font summary
    const summaryFonts = $('#summary-fonts');
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
  // Remove selected class from all platform cards
  $$('.platform-card').forEach(card => card.classList.remove('selected'));
  
  // Add selected class to clicked platform
  const selectedCard = $(`.platform-card[data-platform="${platform}"]`);
  if (selectedCard) {
    selectedCard.classList.add('selected');
  }

  wizardData.platform = platform;
  saveWizardData();

  populateVersionSelect();
  const versionSection = $('#versionSection');
  if (versionSection) {
    versionSection.classList.add('show');
  }
  
  updateThemeGrid();
  updateNextButton();
}

// Theme selection functions
function selectTheme(themeName) {
  wizardData.theme = themeName;

  // Update visual state
  $$('.theme-item').forEach(item => item.classList.remove('selected'));
  
  const selectedTheme = $(`[data-theme="${themeName}"]`);
  if (selectedTheme) {
    selectedTheme.classList.add('selected');
  }

  saveWizardData();
  updateSummary();
  updateNextButton();
}

// Sample data selection
function selectSampleData(sampleType) {
  wizardData.sampleData = sampleType;

  // Update visual state
  $$('.sample-item').forEach(item => item.classList.remove('selected'));
  
  const selectedSample = $(`[data-sample="${sampleType}"]`);
  if (selectedSample) {
    selectedSample.classList.add('selected');
  }

  saveWizardData();
  updateSummary();
}

// Helper functions
function populateFormFields() {
  // Store info
  if (wizardData.storeInfo) {
    const storeNameInput = $('#storeName');
    if (storeNameInput) {
      storeNameInput.value = wizardData.storeInfo.name || "Sample Store";
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

  // Colors
  if (wizardData.styling && wizardData.styling.colors) {
    const colors = wizardData.styling.colors;
    
    const primaryColorPicker = $('#primaryColorPicker');
    const primaryColorValue = $('#primaryColorValue');
    const secondaryColorPicker = $('#secondaryColorPicker');
    const secondaryColorValue = $('#secondaryColorValue');
    const tertiaryColorPicker = $('#tertiaryColorPicker');
    const tertiaryColorValue = $('#tertiaryColorValue');
    
    if (colors.primary) {
      if (primaryColorPicker) primaryColorPicker.value = colors.primary;
      if (primaryColorValue) primaryColorValue.value = colors.primary;
    }
    if (colors.secondary) {
      if (secondaryColorPicker) secondaryColorPicker.value = colors.secondary;
      if (secondaryColorValue) secondaryColorValue.value = colors.secondary;
    }
    if (colors.tertiary) {
      if (tertiaryColorPicker) tertiaryColorPicker.value = colors.tertiary;
      if (tertiaryColorValue) tertiaryColorValue.value = colors.tertiary;
    }
    
    updateColorGuide();
  }

  // Update plugin states after rendering
  setTimeout(() => {
    if (wizardData.plugins) {
      Object.entries(wizardData.plugins).forEach(([pluginId, isEnabled]) => {
        const checkbox = $('#' + pluginId);
        if (checkbox) {
          checkbox.checked = isEnabled;
          if (isEnabled) {
            const pluginItem = checkbox.closest('.plugin-item');
            if (pluginItem) {
              pluginItem.classList.add('selected');
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
  const select = $('#versionSelect');
  if (!select) return;
  
  select.innerHTML = '<option value="">Choose version...</option>';

  if (wizardData.platform && platformData[wizardData.platform]) {
    const versions = Object.keys(platformData[wizardData.platform].versions);
    versions.forEach((version) => {
      const option = document.createElement('option');
      option.value = version;
      option.textContent = version;
      if (version === wizardData.version) {
        option.selected = true;
      }
      select.appendChild(option);
    });
  }
}

function updateThemeGrid() {
  const defaultThemes = $$('.default-themes');
  const magentoThemes = $$('.magento-themes');
  
  if (wizardData.platform === "magento") {
    defaultThemes.forEach(theme => theme.style.display = 'none');
    magentoThemes.forEach(theme => theme.style.display = 'block');

    // Set default theme for Magento if none selected
    if (!wizardData.theme) {
      selectTheme("luma");
    }
  } else {
    defaultThemes.forEach(theme => theme.style.display = 'block');
    magentoThemes.forEach(theme => theme.style.display = 'none');

    // Set default theme for other platforms if none selected
    if (!wizardData.theme || wizardData.theme === "luma" || wizardData.theme === "hyva") {
      selectTheme("default");
    }
  }

  // Update visual selection
  setTimeout(() => {
    if (wizardData.theme) {
      const selectedTheme = $(`[data-theme="${wizardData.theme}"]`);
      if (selectedTheme) {
        selectedTheme.classList.add('selected');
      }
    }
  }, 100);

  saveWizardData();
  updateNextButton();
}

function renderPluginSections() {
  const container = $('#pluginSections');
  if (!container) return;
  
  container.innerHTML = '';

  Object.entries(pluginData).forEach(([sectionKey, section]) => {
    const sectionDiv = document.createElement('div');
    sectionDiv.className = 'plugin-section';
    
    const pluginsHtml = section.plugins.map(plugin => `
      <div class="plugin-item ${plugin.selected ? 'selected' : ''}" data-plugin="${plugin.id}">
        <div class="plugin-info">
          <h4 class="plugin-name">${plugin.name}</h4>
          <p class="plugin-description">${plugin.description}</p>
          ${plugin.needsLicense ? '<p class="plugin-license-text">Requires license key</p>' : ''}
        </div>
        <div class="plugin-controls">
          <div class="plugin-toggle">
            <input type="checkbox" id="${plugin.id}" class="plugin-checkbox" ${plugin.selected ? 'checked' : ''}>
            <label for="${plugin.id}" class="toggle-switch"></label>
          </div>
        </div>
      </div>
    `).join('');
    
    sectionDiv.innerHTML = `
      <h3 class="plugin-section-title">${section.title}</h3>
      <p class="plugin-section-description">${section.description}</p>
      <div class="plugin-list">
        ${pluginsHtml}
      </div>
    `;
    
    container.appendChild(sectionDiv);
  });
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

function updateColorGuide() {
  const primaryColorPicker = $('#primaryColorPicker');
  const secondaryColorPicker = $('#secondaryColorPicker');
  const tertiaryColorPicker = $('#tertiaryColorPicker');
  
  const primaryDemo = $('.primary-demo');
  const secondaryDemo = $('.secondary-demo');
  const tertiaryDemo = $('.tertiary-demo');

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

// Start installation
function startInstallation() {
  console.log("Starting installation...");
  // This function would normally trigger the installation process
  // For now, just show a success message
  alert("Installation would start here! All wizard steps completed successfully.");
}

// Placeholder functions for features that require jQuery replacement
function openLicenseModal(pluginId, pluginName, isRequired) {
  console.log("License modal would open for:", pluginName);
  // This would need to be implemented with vanilla JS modal functionality
}

// Make functions globally available for onclick handlers
window.selectTheme = selectTheme;
window.selectSampleData = selectSampleData;
window.selectPlatform = selectPlatform;
window.updateColorGuide = updateColorGuide;
window.openLicenseModal = openLicenseModal;

// Update placeholders
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

// Dependency icons mapping
const dependencyIcons = {
  php: "fab fa-php",
  mariadb: "fas fa-database",
  redis: "fas fa-memory",
  opensearch: "fas fa-search",
};

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

// Initialize wizard
$(document).ready(function () {
  console.log("DOM Ready - Initializing wizard...");

  // Set default values first
  wizardData.storeInfo = wizardData.storeInfo || {};
  wizardData.storeInfo.name = "Sample Store";

  loadPluginData();
  loadWizardData();
  initializeEventHandlers();
  updateDisplay();

  // Force populate store name field
  $("#storeName").val(wizardData.storeInfo.name);

  // Force enable button for step 1 since we have a valid store name
  console.log("Forcing button enable on page load");
  const nextBtn = $("#nextBtn");
  nextBtn.prop("disabled", false);
  nextBtn.removeClass("disabled");
  nextBtn.css({
    opacity: "1",
    "pointer-events": "auto",
    cursor: "pointer"
  });
  
  // Ensure button state is correct after initialization
  setTimeout(() => {
    updateNextButton();
  }, 100);
});

// Load plugin data from JSON
async function loadPluginData() {
  try {
    const response = await fetch("assets/data/plugins-data.json");
    pluginData = await response.json();
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

// Render plugin sections
function renderPluginSections() {
  const container = $("#pluginSections");
  container.empty();

  Object.entries(pluginData).forEach(([sectionKey, section]) => {
    const sectionHtml = `
      <div class="plugin-section">
        <h3 class="plugin-section-title">${section.title}</h3>
        <p class="plugin-section-description">${section.description}</p>
        <div class="plugin-list">
          ${section.plugins
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
                  <input type="checkbox" id="${
                    plugin.id
                  }" class="plugin-checkbox" ${
                plugin.selected ? "checked" : ""
              }>
                  <label for="${plugin.id}" class="toggle-switch"></label>
                </div>
              </div>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    `;
    container.append(sectionHtml);
  });
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

// Initialize event handlers
function initializeEventHandlers() {
  // Platform selection
  $(".platform-card").off("click").on("click", function () {
    const platform = $(this).data("platform");
    selectPlatform(platform);
  });

  // Version selection
  $("#versionSelect").off("change").on("change", function () {
    const version = $(this).val();
    wizardData.version = version;
    saveWizardData();

    if (version) {
      showDependencies();
      updateNextButton();
    } else {
      $("#dependenciesDisplay").removeClass("show");
      updateNextButton();
    }
  });

  // Navigation buttons
  $("#nextBtn").off("click").on("click", function () {
    console.log("Next button clicked!");
    
    if ($(this).prop("disabled")) {
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

  $("#prevBtn").off("click").on("click", function () {
    if (currentStep > 1) {
      prevStep();
    }
  });

  // Form inputs - single handler for store name
  $("#storeName").off("input change blur").on("input change blur", function () {
    const storeName = $(this).val().trim();
    console.log("Store name input changed to:", storeName);

    wizardData.storeInfo = wizardData.storeInfo || {};
    wizardData.storeInfo.name = storeName;
    saveWizardData();
    updateSummary();

    // Immediate button update
    updateNextButton();
  });

  // Theme selection handlers
  $(document).off("click", ".theme-clickable").on("click", ".theme-clickable", function () {
    const theme = $(this).data("theme");
    selectTheme(theme);
  });

  // Plugin toggles
  $(document).off("change", ".plugin-checkbox").on("change", ".plugin-checkbox", function () {
    const pluginId = $(this).attr("id");
    const isChecked = $(this).is(":checked");

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
    const pluginItem = $(this).closest(".plugin-item");
    if (isChecked) {
      pluginItem.addClass("selected");
    } else {
      pluginItem.removeClass("selected");
      // Remove license key if plugin is disabled
      if (wizardData.licenseKeys[pluginId]) {
        delete wizardData.licenseKeys[pluginId];
      }
    }

    saveWizardData();
    updateSummary();
  });

  // Sample data selection handlers
  $(document).off("click", ".sample-clickable").on("click", ".sample-clickable", function () {
    const sampleType = $(this).data("sample");
    selectSampleData(sampleType);
  });
}

// Duplicate event handlers removed - using consolidated handlers in initializeEventHandlers()

// Platform selection
function selectPlatform(platform) {
  $(".platform-card").removeClass("selected");
  $(`.platform-card[data-platform="${platform}"]`).addClass("selected");

  wizardData.platform = platform;
  saveWizardData();

  populateVersionSelect();
  $("#versionSection").addClass("show");
  updateThemeGrid();
  updateNextButton();
}

// Style tab functions
function switchStyleTab(tabName) {
  // Update tab buttons
  document.querySelectorAll(".style-tabs .tab-button").forEach((btn) => {
    btn.classList.remove("active");
  });
  document.querySelector(`[data-tab="${tabName}"]`).classList.add("active");

  // Update tab content
  document.querySelectorAll(".style-tabs .tab-panel").forEach((panel) => {
    panel.classList.remove("active");
  });
  document
    .querySelector(`.style-tabs .tab-panel[data-tab="${tabName}"]`)
    .classList.add("active");
}

// Get selected theme
function getSelectedTheme() {
  const selectedRadio = document.querySelector(
    'input[name="theme-selection"]:checked'
  );
  return selectedRadio ? selectedRadio.value : "luma";
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

    const preview = document.getElementById(previewId);
    const image = document.getElementById(imageId);

    image.src = e.target.result;
    preview.style.display = "block";

    // Save to wizard data
    wizardData.styling = wizardData.styling || {};
    wizardData.styling.logos = wizardData.styling.logos || {};
    wizardData.styling.logos[type] = e.target.result;

    saveWizardData();
    updateSummary();
  };
  reader.readAsDataURL(file);
}

// Color functions
function updateColor(colorType) {
  const picker = document.getElementById(`${colorType}ColorPicker`);
  const value = document.getElementById(`${colorType}ColorValue`);

  value.value = picker.value;
  saveColorToWizardData(colorType, picker.value);
}

function updateColorFromText(colorType) {
  const picker = document.getElementById(`${colorType}ColorPicker`);
  const value = document.getElementById(`${colorType}ColorValue`);

  if (/^#[0-9A-F]{6}$/i.test(value.value)) {
    picker.value = value.value;
    saveColorToWizardData(colorType, value.value);
  }
}

function saveColorToWizardData(colorType, colorValue) {
  wizardData.styling = wizardData.styling || {};
  wizardData.styling.colors = wizardData.styling.colors || {};
  wizardData.styling.colors[colorType] = colorValue;

  saveWizardData();
  updateSummary();
}

// Font functions
function updateFontFamily() {
  const fontSelect = document.getElementById("fontFamilySelect");
  const previewText = document.getElementById("fontPreviewText");

  const selectedFont = fontSelect.value;

  if (selectedFont === "default") {
    previewText.style.fontFamily = "Montserrat";
  } else {
    previewText.style.fontFamily = selectedFont;
  }

  wizardData.styling = wizardData.styling || {};
  wizardData.styling.fonts = selectedFont;

  saveWizardData();
  updateSummary();
}

// Update theme grid based on selected platform
function updateThemeGrid() {
  if (wizardData.platform === "magento") {
    $(".default-themes").hide();
    $(".magento-themes").show();

    // Set default theme for Magento
    if (!wizardData.theme) {
      wizardData.theme = "luma";
      $("#luma-theme").prop("checked", true);
    }
  } else {
    $(".default-themes").show();
    $(".magento-themes").hide();

    // Set default theme for other platforms
    if (!wizardData.theme) {
      wizardData.theme = "default";
      $("#default-theme").prop("checked", true);
    }
  }

  saveWizardData();
  updateNextButton();
}

// Populate version dropdown
function populateVersionSelect() {
  const select = $("#versionSelect");
  select.empty().append('<option value="">Choose version...</option>');

  if (wizardData.platform && platformData[wizardData.platform]) {
    const versions = Object.keys(platformData[wizardData.platform].versions);
    versions.forEach((version) => {
      const selected = version === wizardData.version ? "selected" : "";
      select.append(
        `<option value="${version}" ${selected}>${version}</option>`
      );
    });
  }
}

// Show dependencies
function showDependencies() {
  if (wizardData.platform && wizardData.version) {
    const dependencies =
      platformData[wizardData.platform].versions[wizardData.version];
    const container = $("#dependenciesList");
    container.empty();

    Object.entries(dependencies).forEach(([dep, version]) => {
      if (version !== "N/A") {
        const iconClass = dependencyIcons[dep] || "fas fa-cog";
        container.append(`
          <div class="dependency-item">
            <div class="dependency-icon ${dep}">
              <i class="${iconClass}"></i>
            </div>
            <div class="dependency-details">
              <div class="dependency-name">${dep.toUpperCase()}</div>
              <div class="dependency-version">v${version}</div>
            </div>
          </div>
        `);
      }
    });

    $("#dependenciesDisplay").addClass("show");
  }
}

// Helper functions for plugins
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

// Theme selection functions
function selectTheme(themeName) {
  wizardData.theme = themeName;

  // Update visual state
  document.querySelectorAll(".theme-item").forEach((item) => {
    item.classList.remove("selected");
  });
  document
    .querySelector(`[data-theme="${themeName}"]`)
    .classList.add("selected");

  saveWizardData();
  updateSummary();
  updateNextButton();
}

// Sample data selection
function selectSampleData(sampleType) {
  wizardData.sampleData = sampleType;

  // Update visual state
  document.querySelectorAll(".sample-item").forEach((item) => {
    item.classList.remove("selected");
  });
  document
    .querySelector(`[data-sample="${sampleType}"]`)
    .classList.add("selected");

  saveWizardData();
  updateSummary();
}

// Font functions
function toggleFontSelection() {
  const useDefault = document.getElementById("useDefaultFont").checked;
  const customSelection = document.getElementById("customFontSelection");

  if (useDefault) {
    customSelection.style.display = "none";
    wizardData.styling.useDefaultFont = true;
    wizardData.styling.fonts = "default";

    // Reset preview to default
    document.getElementById("fontPreviewText").style.fontFamily = "Montserrat";
  } else {
    customSelection.style.display = "block";
    wizardData.styling.useDefaultFont = false;
  }

  saveWizardData();
  updateSummary();
}

function updateCustomFont() {
  const fontInput = document.getElementById("fontSearchInput");
  const fontName = fontInput.value.trim();

  if (fontName) {
    wizardData.styling.fonts = fontName;
    document.getElementById("fontPreviewText").style.fontFamily = fontName;
    saveWizardData();
    updateSummary();
  }
}

// License modal functions (updated)
function openLicenseModal(pluginId, pluginName, isRequired = false) {
  currentLicensePlugin = pluginId;
  $("#licenseModalTitle").text(`Enter License Key for ${pluginName}`);
  $("#licenseKeyInput").val(wizardData.licenseKeys[pluginId] || "");

  if (isRequired) {
    $("#licenseKeyInput").attr("required", true);
  }

  $("#licenseModal").addClass("show");
  $("body").addClass("modal-open");
}

function closeLicenseModal() {
  const isRequired = $("#licenseKeyInput").attr("required");

  if (isRequired && currentLicensePlugin) {
    // If license is required and modal is closed without saving, uncheck the plugin
    const checkbox = $(`#${currentLicensePlugin}`);
    checkbox.prop("checked", false);
    checkbox.closest(".plugin-item").removeClass("selected");
    delete wizardData.plugins[currentLicensePlugin];
    saveWizardData();
  }

  $("#licenseModal").removeClass("show");
  $("body").removeClass("modal-open");
  currentLicensePlugin = null;
  $("#licenseKeyInput").removeAttr("required");
}

function saveLicenseKey() {
  const licenseKey = $("#licenseKeyInput").val().trim();

  if (!licenseKey) {
    alert("Please enter a license key");
    return;
  }

  if (currentLicensePlugin) {
    wizardData.licenseKeys[currentLicensePlugin] = licenseKey;
    wizardData.plugins[currentLicensePlugin] = true;

    // Update plugin visual state
    const checkbox = $(`#${currentLicensePlugin}`);
    checkbox.prop("checked", true);
    checkbox.closest(".plugin-item").addClass("selected");

    saveWizardData();
    updateSummary();
    closeLicenseModal();
  }
}

// Theme preview functions
function openThemePreview(themeName) {
  const modal = document.getElementById("themePreviewModal");
  const modalTitle = document.getElementById("modalThemeTitle");
  const desktopPreview = document.getElementById("desktopPreview");
  const mobilePreview = document.getElementById("mobilePreview");
  const stylingTabBtn = document.querySelector(
    '.theme-tab-btn[onclick*="styling"]'
  );

  const themeData = themePreviewData[themeName];
  if (themeData) {
    modalTitle.textContent = themeData.name + " Preview";
    desktopPreview.src = themeData.desktop;
    mobilePreview.src = themeData.mobile;

    stylingTabBtn.style.display = "block";
    modal.classList.add("show");
    $("body").addClass("modal-open");
  }
}

function closeThemePreview() {
  const modal = document.getElementById("themePreviewModal");
  const stylingTabBtn = document.querySelector(
    '.theme-tab-btn[onclick*="styling"]'
  );
  const previewTab = document.getElementById("previewTab");
  const stylingTab = document.getElementById("stylingTab");

  modal.classList.remove("show");
  $("body").removeClass("modal-open");

  document
    .querySelectorAll(".theme-tab-btn")
    .forEach((btn) => btn.classList.remove("active"));
  document
    .querySelector('.theme-tab-btn[onclick*="preview"]')
    .classList.add("active");
  stylingTabBtn.style.display = "none";

  stylingTab.classList.remove("active");
  previewTab.classList.add("active");
}

function switchThemeTab(tabName) {
  document.querySelectorAll(".theme-tab-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  event.target.classList.add("active");

  document.querySelectorAll(".theme-tab-content").forEach((content) => {
    content.classList.remove("active");
  });

  if (tabName === "preview") {
    document.getElementById("previewTab").classList.add("active");
  } else if (tabName === "styling") {
    document.getElementById("stylingTab").classList.add("active");
  }
}

// Styling functions
function handleLogoUpload(input) {
  const file = input.files[0];
  if (file) {
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
      const logoPreview = document.getElementById("logoPreview");
      const logoImage = document.getElementById("logoImage");

      logoImage.src = e.target.result;
      logoPreview.style.display = "block";

      wizardData.styling = wizardData.styling || {};
      wizardData.styling.logo = e.target.result;
      saveWizardData();
      updateSummary();
    };
    reader.readAsDataURL(file);
  }
}

function updateColorValue(pickerId, valueId) {
  const picker = document.getElementById(pickerId);
  const value = document.getElementById(valueId);
  value.value = picker.value;
  saveColorSettings();
}

function updateColorPicker(valueId, pickerId) {
  const value = document.getElementById(valueId);
  const picker = document.getElementById(pickerId);

  if (/^#[0-9A-F]{6}$/i.test(value.value)) {
    picker.value = value.value;
    saveColorSettings();
  }
}

function saveColorSettings() {
  wizardData.styling = wizardData.styling || {};
  wizardData.styling.colors = {
    primary: document.getElementById("primaryColor").value,
    secondary: document.getElementById("secondaryColor").value,
    tertiary: document.getElementById("tertiaryColor").value,
  };
  saveWizardData();
  updateSummary();
}

function updateFontPreview() {
  const fontFamily = document.getElementById("fontFamily").value;
  document.getElementById("fontPreview").style.fontFamily =
    fontFamily === "default" ? "Montserrat" : fontFamily;

  wizardData.styling = wizardData.styling || {};
  wizardData.styling.fonts = fontFamily;
  saveWizardData();
  updateSummary();
}

// Populate form fields from saved data
function populateFormFields() {
  // Store info
  if (wizardData.storeInfo) {
    $("#storeName").val(wizardData.storeInfo.name || "Sample Store");
  }

  // Platform selection
  if (wizardData.platform) {
    selectPlatform(wizardData.platform);
    updateThemeGrid();
  }

  // Theme selection
  if (wizardData.theme) {
    $(`input[name="theme-selection"][value="${wizardData.theme}"]`).prop(
      "checked",
      true
    );
  }

  // Sample data
  if (wizardData.sampleData) {
    $(`input[name="sample-data"][value="${wizardData.sampleData}"]`).prop(
      "checked",
      true
    );
  }

  // Colors
  if (wizardData.styling && wizardData.styling.colors) {
    const colors = wizardData.styling.colors;
    if (colors.primary) {
      $("#primaryColorPicker").val(colors.primary);
      $("#primaryColorValue").val(colors.primary);
    }
    if (colors.secondary) {
      $("#secondaryColorPicker").val(colors.secondary);
      $("#secondaryColorValue").val(colors.secondary);
    }
  }

  // Fonts
  if (wizardData.styling && wizardData.styling.fonts) {
    $("#fontFamilySelect").val(wizardData.styling.fonts);
    updateFontFamily();
  }

  // Logos
  if (wizardData.styling && wizardData.styling.logos) {
    if (wizardData.styling.logos.desktop) {
      $("#desktopLogoImage").attr("src", wizardData.styling.logos.desktop);
      $("#desktopLogoPreview").show();
    }
    if (wizardData.styling.logos.mobile) {
      $("#mobileLogoImage").attr("src", wizardData.styling.logos.mobile);
      $("#mobileLogoPreview").show();
    }
  }

  // Update plugin states after rendering
  setTimeout(() => {
    if (wizardData.plugins) {
      Object.entries(wizardData.plugins).forEach(([pluginId, isEnabled]) => {
        const checkbox = $(`#${pluginId}`);
        if (checkbox.length) {
          checkbox.prop("checked", isEnabled);
          if (isEnabled) {
            checkbox.closest(".plugin-item").addClass("selected");
          }
        }
      });
    }
  }, 100);
}

// Update summary
function updateSummary() {
  $("#summary-store-name").text(wizardData.storeInfo?.name || "a");
  $("#summary-version").text(wizardData.version || "2_4_7");
  $("#summary-selected-theme").text(wizardData.theme || "Luma");

  if (wizardData.styling) {
    // Logo summary
    if (wizardData.styling.logos) {
      $("#summary-desktop-logo").text(
        wizardData.styling.logos.desktop
          ? "Desktop logo uploaded"
          : "No desktop logo uploaded"
      );
      $("#summary-mobile-logo").text(
        wizardData.styling.logos.mobile
          ? "Mobile logo uploaded"
          : "No mobile logo uploaded"
      );
    }

    // Color summary
    if (wizardData.styling.colors) {
      $("#summary-primary-color").text(
        wizardData.styling.colors.primary || "#4e54c8"
      );
      $("#summary-secondary-color").text(
        wizardData.styling.colors.secondary || "#8f94fb"
      );
      $("#summary-tertiary-color").text(
        wizardData.styling.colors.tertiary || "#19b78a"
      );
    }

    // Font summary
    if (wizardData.styling.fonts) {
      $("#summary-fonts").text(
        wizardData.styling.fonts === "default"
          ? "Using Default Theme Font"
          : wizardData.styling.fonts
      );
    }
  }
}

// Navigation functions
function nextStep() {
  console.log("nextStep called, current step:", currentStep);
  const isValid = validateCurrentStep();
  console.log("Step validation result:", isValid);
  
  if (isValid) {
    currentStep++;
    console.log("Advancing to step:", currentStep);
    updateStepDisplay();
    updateProgressBar();
    updateNavigation();
  } else {
    console.log("Validation failed, not advancing");
  }
}

function prevStep() {
  currentStep--;
  updateStepDisplay();
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

// Update step display
function updateStepDisplay() {
  $(".step-content").removeClass("active");
  $(`.step-content[data-step="${currentStep}"]`).addClass("active");

  $(".step-item").removeClass("active completed");
  $(`.step-item[data-step="${currentStep}"]`).addClass("active");

  for (let i = 1; i < currentStep; i++) {
    $(`.step-item[data-step="${i}"]`).addClass("completed");
  }
}

// Update progress bar
function updateProgressBar() {
  const progress = (currentStep / 6) * 100;
  $(".progress-fill").css("width", progress + "%");

  const stepTexts = {
    1: "Step 1 of 6 - Store Info",
    2: "Step 2 of 6 - Platform",
    3: "Step 3 of 6 - Styles",
    4: "Step 4 of 6 - Plugin Settings",
    5: "Step 5 of 6 - Sample Data",
    6: "Step 6 of 6 - Summary",
  };

  $(".progress-text").text(stepTexts[currentStep]);
  $(".nav-info .current-step").text(`Step ${currentStep} of 6`);
}

// Update navigation buttons
function updateNavigation() {
  $("#prevBtn").prop("disabled", currentStep === 1);

  if (currentStep === 6) {
    $("#nextBtn").html('<i class="fas fa-rocket"></i> Start Installation');
  } else {
    $("#nextBtn").html('Next Step <i class="fas fa-arrow-right"></i>');
  }

  updateNextButton();
}

// Duplicate updateNextButton function removed - using the one defined earlier

// Update display
function updateDisplay() {
  updateStepDisplay();
  updateProgressBar();
  updateNavigation();
  updateSummary();
}

// Start installation
function startInstallation() {
  const steps = [
    { selector: ".install-step:nth-child(1)", delay: 1000 },
    { selector: ".install-step:nth-child(2)", delay: 3000 },
    { selector: ".install-step:nth-child(3)", delay: 5000 },
    { selector: ".install-step:nth-child(4)", delay: 7000 },
  ];

  $("#nextBtn")
    .prop("disabled", true)
    .html('<i class="fas fa-spinner fa-spin"></i> Installing...');

  steps.forEach((step, index) => {
    setTimeout(() => {
      if (index > 0) {
        const prevStep = $(steps[index - 1].selector);
        prevStep.removeClass("active").addClass("completed");
        prevStep
          .find(".install-status i")
          .removeClass("fa-spinner fa-spin")
          .addClass("fa-check");
      }

      const currentStepEl = $(step.selector);
      currentStepEl.addClass("active");
      currentStepEl
        .find(".install-status i")
        .removeClass("fa-clock")
        .addClass("fa-spinner fa-spin");

      if (index === steps.length - 1) {
        setTimeout(() => {
          currentStepEl.removeClass("active").addClass("completed");
          currentStepEl
            .find(".install-status i")
            .removeClass("fa-spinner fa-spin")
            .addClass("fa-check");

          $("#nextBtn")
            .prop("disabled", false)
            .html('<i class="fas fa-external-link-alt"></i> Open Website');

          showSuccessMessage();
        }, 2000);
      }
    }, step.delay);
  });
}

// Show success message
function showSuccessMessage() {
  const storeName = wizardData.storeInfo?.name || "Your Website";
  const storeUrl = "yourwebsite.com";

  const successHtml = `
    <div class="success-message" style="
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #fff;
        padding: 4rem;
        border-radius: 2rem;
        box-shadow: 0 2rem 4rem rgba(0,0,0,.3);
        z-index: 1000;
        text-align: center;
        max-width: 50rem;
    ">
        <i class="fas fa-check-circle" style="font-size: 6rem; color: #32be7d; margin-bottom: 2rem;"></i>
        <h2 class="h3-headline" style="color: #0f488a; margin-bottom: 2rem;">Installation Complete!</h2>
        <p class="p-text" style="margin-bottom: 3rem;">
            ${storeName} has been successfully installed and is ready to use.
        </p>
        <div style="margin-bottom: 3rem;">
            <p><strong>Website URL:</strong> https://${storeUrl}</p>
            <p><strong>Admin Panel:</strong> https://${storeUrl}/admin</p>
        </div>
        <button onclick="closeSuccessMessage()" class="button" style="margin-top: 0;">
            <i class="fas fa-times"></i> Close
        </button>
    </div>
    <div class="overlay" style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        z-index: 999;
    " onclick="closeSuccessMessage()"></div>
  `;

  $("body").append(successHtml);
}

// Close success message
function closeSuccessMessage() {
  $(".success-message, .overlay").remove();

  if (confirm("Would you like to create another website?")) {
    resetWizard();
  }
}

// Reset wizard
function resetWizard() {
  localStorage.removeItem("wizardData");
  location.reload();
}

// Form validation helpers
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validatePassword(password) {
  return password.length >= 8;
}

function validateUrl(url) {
  const re =
    /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return re.test(url);
}

// Real-time validation
$(document).ready(function () {
  // Email validation
  $("#adminEmail").on("blur", function () {
    const email = $(this).val();
    if (email && !validateEmail(email)) {
      $(this).addClass("error");
      showFieldError(this, "Please enter a valid email address");
    } else {
      $(this).removeClass("error");
      hideFieldError(this);
    }
  });

  // Password validation
  $("#adminPassword").on("input", function () {
    const password = $(this).val();
    if (password && !validatePassword(password)) {
      $(this).addClass("error");
      showFieldError(this, "Password must be at least 8 characters long");
    } else {
      $(this).removeClass("error");
      hideFieldError(this);
    }
  });

  // URL validation
  $("#storeUrl").on("blur", function () {
    const url = $(this).val();
    if (url && !validateUrl(url)) {
      $(this).addClass("error");
      showFieldError(this, "Please enter a valid domain name");
    } else {
      $(this).removeClass("error");
      hideFieldError(this);
    }
  });
});

// Show field error
function showFieldError(field, message) {
  const $field = $(field);
  let $error = $field.next(".field-error");

  if ($error.length === 0) {
    $error = $(
      '<div class="field-error" style="color: #ff7101; font-size: 1.4rem; margin-top: 0.5rem;"></div>'
    );
    $field.after($error);
  }

  $error.text(message);
}

// Hide field error
function hideFieldError(field) {
  $(field).next(".field-error").remove();
}

// Add error styles
$("<style>")
  .prop("type", "text/css")
  .html(
    `
    .form-input.error,
    .form-textarea.error,
    .form-select.error {
        border-color: #ff7101 !important;
        box-shadow: 0 0 0 .3rem rgba(255, 113, 1, .2) !important;
    }
`
  )
  .appendTo("head");

// Close modal when clicking outside
document.addEventListener("click", function (event) {
  const themeModal = document.getElementById("themePreviewModal");
  const licenseModal = document.getElementById("licenseModal");

  if (event.target === themeModal) {
    closeThemePreview();
  }

  // Don't close license modal on clicking overlay - let the onclick handler do it
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
window.updateColorValue = updateColorValue;
window.updateColorPicker = updateColorPicker;
window.updateFontPreview = updateFontPreview;
window.closeSuccessMessage = closeSuccessMessage;
window.openLicenseModal = openLicenseModal;
window.closeLicenseModal = closeLicenseModal;
window.saveLicenseKey = saveLicenseKey;
window.switchStyleTab = switchStyleTab;
window.getSelectedTheme = getSelectedTheme;
window.updateColor = updateColor;
window.updateColorFromText = updateColorFromText;
window.updateFontFamily = updateFontFamily;
