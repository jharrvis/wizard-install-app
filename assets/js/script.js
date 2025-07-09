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
      "https://via.placeholder.com/800x600/ffffff/666666?text=Default+Desktop+Preview",
    mobile:
      "https://via.placeholder.com/400x600/ffffff/666666?text=Default+Mobile+Preview",
  },
  ecommerce: {
    name: "E-commerce Pro",
    desktop:
      "https://via.placeholder.com/800x600/f0f0f0/333333?text=Ecommerce+Desktop+Preview",
    mobile:
      "https://via.placeholder.com/400x600/f0f0f0/333333?text=Ecommerce+Mobile+Preview",
  },
  business: {
    name: "Business Theme",
    desktop:
      "https://via.placeholder.com/800x600/e8e8e8/444444?text=Business+Desktop+Preview",
    mobile:
      "https://via.placeholder.com/400x600/e8e8e8/444444?text=Business+Mobile+Preview",
  },
};

// Open theme preview modal
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

    // Show the styling tab button now that a theme is selected
    stylingTabBtn.style.display = "block";

    modal.classList.add("show");
    document.body.style.overflow = "hidden";
  }
}

// Close theme preview modal
function closeThemePreview() {
  const modal = document.getElementById("themePreviewModal");
  const stylingTabBtn = document.querySelector(
    '.theme-tab-btn[onclick*="styling"]'
  );
  const previewTab = document.getElementById("previewTab");
  const stylingTab = document.getElementById("stylingTab");

  modal.classList.remove("show");
  document.body.style.overflow = "auto";

  // Reset to preview tab and hide styling tab
  document
    .querySelectorAll(".theme-tab-btn")
    .forEach((btn) => btn.classList.remove("active"));
  document
    .querySelector('.theme-tab-btn[onclick*="preview"]')
    .classList.add("active");
  stylingTabBtn.style.display = "none"; // Hide styling tab until theme is selected

  // Reset tab content
  stylingTab.classList.remove("active");
  previewTab.classList.add("active");
}

// Switch theme tabs
function switchThemeTab(tabName) {
  // Update tab buttons
  document.querySelectorAll(".theme-tab-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  event.target.classList.add("active");

  // Update tab content
  document.querySelectorAll(".theme-tab-content").forEach((content) => {
    content.classList.remove("active");
  });

  if (tabName === "preview") {
    document.getElementById("previewTab").classList.add("active");
  } else if (tabName === "styling") {
    document.getElementById("stylingTab").classList.add("active");
  }
}

// Handle logo upload
function handleLogoUpload(input) {
  const file = input.files[0];
  if (file) {
    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert("File size must be less than 2MB");
      return;
    }

    // Check file type
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

      // Save logo data
      wizardData.styling = wizardData.styling || {};
      wizardData.styling.logo = e.target.result;
      saveWizardData();
    };
    reader.readAsDataURL(file);
  }
}

// Update color value from picker
function updateColorValue(pickerId, valueId) {
  const picker = document.getElementById(pickerId);
  const value = document.getElementById(valueId);
  value.value = picker.value;

  // Save to wizard data
  saveColorSettings();
}

// Update color picker from value
function updateColorPicker(valueId, pickerId) {
  const value = document.getElementById(valueId);
  const picker = document.getElementById(pickerId);

  // Validate hex color
  if (/^#[0-9A-F]{6}$/i.test(value.value)) {
    picker.value = value.value;
    saveColorSettings();
  }
}

// Save color settings
function saveColorSettings() {
  wizardData.styling = wizardData.styling || {};
  wizardData.styling.colors = {
    primary: document.getElementById("primaryColor").value,
    secondary: document.getElementById("secondaryColor").value,
    text: document.getElementById("textColor").value,
    background: document.getElementById("bgColor").value,
  };
  saveWizardData();
}

// Update font preview
function updateFontPreview() {
  const headingFont = document.getElementById("headingFont").value;
  const bodyFont = document.getElementById("bodyFont").value;

  document.getElementById("headingPreview").style.fontFamily = headingFont;
  document.getElementById("bodyPreview").style.fontFamily = bodyFont;

  // Save font settings
  wizardData.styling = wizardData.styling || {};
  wizardData.styling.fonts = {
    heading: headingFont,
    body: bodyFont,
  };
  saveWizardData();
}

// Close modal when clicking outside
document.addEventListener("click", function (event) {
  const modal = document.getElementById("themePreviewModal");
  if (event.target === modal) {
    closeThemePreview();
  }
});

// Close modal with Escape key
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closeThemePreview();
  }
});

// Make functions global for onclick handlers
window.openThemePreview = openThemePreview;
window.closeThemePreview = closeThemePreview;
window.switchThemeTab = switchThemeTab;
window.handleLogoUpload = handleLogoUpload;
window.updateColorValue = updateColorValue;
window.updateColorPicker = updateColorPicker;
window.updateFontPreview = updateFontPreview; // Website Creation Wizard JavaScript

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
let currentTab = "store-info";
let wizardData = {
  platform: null,
  version: null,
  storeInfo: {},
  platformConfig: {},
  theme: null,
  plugins: {},
  sampleData: "none",
};

// Initialize wizard
$(document).ready(function () {
  loadWizardData();
  initializeEventHandlers();
  updateDisplay();
});

// Load data from localStorage
function loadWizardData() {
  const savedData = localStorage.getItem("wizardData");
  if (savedData) {
    wizardData = { ...wizardData, ...JSON.parse(savedData) };
    populateFormFields();
  }
}

// Save data to localStorage
function saveWizardData() {
  localStorage.setItem("wizardData", JSON.stringify(wizardData));
}

// Initialize event handlers
function initializeEventHandlers() {
  // Platform selection
  $(".platform-card").click(function () {
    const platform = $(this).data("platform");
    selectPlatform(platform);
  });

  // Version selection
  $("#versionSelect").change(function () {
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
  $("#nextBtn").click(function () {
    if (currentStep < 3) {
      nextStep();
    } else {
      startInstallation();
    }
  });

  $("#prevBtn").click(function () {
    if (currentStep > 1) {
      prevStep();
    }
  });

  // Tab navigation
  $(".tab-button").click(function () {
    const tab = $(this).data("tab");
    switchTab(tab);
  });

  // Form inputs
  $("input, textarea, select").on("input change", function () {
    saveFormData();
  });

  // Theme selection
  $(".theme-card").click(function () {
    $(".theme-card:visible").removeClass("selected");
    $(this).addClass("selected");
    wizardData.theme = $(this).data("theme");
    saveWizardData();
    updateSummary();
  });

  // Plugin toggles
  $(".plugin-checkbox").change(function () {
    const pluginId = $(this).attr("id");
    const isChecked = $(this).is(":checked");
    wizardData.plugins[pluginId] = isChecked;
    saveWizardData();
    updateSummary();
  });

  // Sample data selection
  $('input[name="sample-data"]').change(function () {
    wizardData.sampleData = $(this).val();
    saveWizardData();
    updateSummary();
  });
}

// Platform selection
function selectPlatform(platform) {
  $(".platform-card").removeClass("selected");
  $(`.platform-card[data-platform="${platform}"]`).addClass("selected");

  wizardData.platform = platform;
  saveWizardData();

  populateVersionSelect();
  $("#versionSection").addClass("show");
  updateSelectedPlatformDisplay();
  updateThemeGrid();
  updateNextButton();
}

// Update theme grid based on selected platform
function updateThemeGrid() {
  if (wizardData.platform === "magento") {
    // Show Magento specific themes
    $(".default-themes").hide();
    $(".magento-themes").show();
  } else {
    // Show default themes for WordPress and Laravel
    $(".default-themes").show();
    $(".magento-themes").hide();
  }

  // Reset theme selection when platform changes
  $(".theme-card").removeClass("selected");
  wizardData.theme = null;
  saveWizardData();
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

// Update selected platform display
function updateSelectedPlatformDisplay() {
  if (wizardData.platform) {
    const platformName =
      wizardData.platform.charAt(0).toUpperCase() +
      wizardData.platform.slice(1);
    const iconClass = `fab fa-${wizardData.platform}`;

    $("#selectedPlatformName").text(platformName);
    $(".platform-icon-large i").removeClass().addClass(iconClass);

    if (wizardData.version) {
      $("#selectedPlatformVersion").text(`Version ${wizardData.version}`);
    }
  }
}

// Switch tabs
function switchTab(tab) {
  currentTab = tab;

  $(".tab-button").removeClass("active");
  $(`.tab-button[data-tab="${tab}"]`).addClass("active");

  $(".tab-panel").removeClass("active");
  $(`.tab-panel[data-tab="${tab}"]`).addClass("active");

  if (tab === "summary") {
    updateSummary();
  }
}

// Save form data
function saveFormData() {
  // Store info
  wizardData.storeInfo = {
    name: $("#storeName").val(),
    url: $("#storeUrl").val(),
    email: $("#adminEmail").val(),
    password: $("#adminPassword").val(),
    description: $("#storeDescription").val(),
  };

  // Platform config
  wizardData.platformConfig = {
    dbName: $("#dbName").val(),
    dbUser: $("#dbUser").val(),
    dbPassword: $("#dbPassword").val(),
    dbHost: $("#dbHost").val(),
  };

  saveWizardData();
  updateSummary();
}

// Populate form fields from saved data
function populateFormFields() {
  // Store info
  if (wizardData.storeInfo) {
    $("#storeName").val(wizardData.storeInfo.name || "");
    $("#storeUrl").val(wizardData.storeInfo.url || "");
    $("#adminEmail").val(wizardData.storeInfo.email || "");
    $("#adminPassword").val(wizardData.storeInfo.password || "");
    $("#storeDescription").val(wizardData.storeInfo.description || "");
  }

  // Platform config
  if (wizardData.platformConfig) {
    $("#dbName").val(wizardData.platformConfig.dbName || "");
    $("#dbUser").val(wizardData.platformConfig.dbUser || "");
    $("#dbPassword").val(wizardData.platformConfig.dbPassword || "");
    $("#dbHost").val(wizardData.platformConfig.dbHost || "localhost");
  }

  // Platform selection
  if (wizardData.platform) {
    selectPlatform(wizardData.platform);
    updateThemeGrid();
  }

  // Theme selection - check if selected theme is visible
  if (wizardData.theme) {
    const selectedThemeCard = $(
      `.theme-card[data-theme="${wizardData.theme}"]`
    );
    if (selectedThemeCard.is(":visible")) {
      selectedThemeCard.addClass("selected");
    } else {
      // Reset theme if not compatible with current platform
      wizardData.theme = null;
      saveWizardData();
    }
  }

  // Plugin settings
  if (wizardData.plugins) {
    Object.entries(wizardData.plugins).forEach(([pluginId, isEnabled]) => {
      $(`#${pluginId}`).prop("checked", isEnabled);
    });
  }

  // Sample data
  if (wizardData.sampleData) {
    $(`input[name="sample-data"][value="${wizardData.sampleData}"]`).prop(
      "checked",
      true
    );
  }
}

// Update summary
function updateSummary() {
  // Platform summary
  if (wizardData.platform && wizardData.version) {
    const platformName =
      wizardData.platform.charAt(0).toUpperCase() +
      wizardData.platform.slice(1);
    $("#summary-platform").html(`
            <p><strong>Platform:</strong> ${platformName}</p>
            <p><strong>Version:</strong> ${wizardData.version}</p>
        `);
  }

  // Store info summary
  if (wizardData.storeInfo && wizardData.storeInfo.name) {
    $("#summary-store").html(`
            <p><strong>Store Name:</strong> ${wizardData.storeInfo.name}</p>
            <p><strong>URL:</strong> ${wizardData.storeInfo.url}</p>
            <p><strong>Admin Email:</strong> ${wizardData.storeInfo.email}</p>
        `);
  }

  // Theme summary
  if (wizardData.theme) {
    const themeNames = {
      default: "Default Theme",
      ecommerce: "E-commerce Pro",
      business: "Business",
      luma: "Luma (Magento Default)",
      hyva: "Hyvä (Premium)",
    };
    const themeName = themeNames[wizardData.theme] || wizardData.theme;
    $("#summary-theme").html(
      `<p><strong>Selected Theme:</strong> ${themeName}</p>`
    );
  }

  // Plugin summary
  const enabledPlugins = Object.entries(wizardData.plugins || {})
    .filter(([key, value]) => value)
    .map(([key, value]) => key.replace("-plugin", "").replace("-", " "))
    .join(", ");

  $("#summary-plugins").html(
    `<p><strong>Enabled Plugins:</strong> ${enabledPlugins || "None"}</p>`
  );
}

// Navigation functions
function nextStep() {
  if (validateCurrentStep()) {
    currentStep++;
    updateStepDisplay();
    updateProgressBar();
    updateNavigation();

    if (currentStep === 2) {
      switchTab("store-info");
    }
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
  if (currentStep === 1) {
    return wizardData.platform && wizardData.version;
  } else if (currentStep === 2) {
    return (
      wizardData.storeInfo &&
      wizardData.storeInfo.name &&
      wizardData.storeInfo.email
    );
  }
  return true;
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
  const progress = (currentStep / 3) * 100;
  $(".progress-fill").css("width", progress + "%");

  const stepTexts = {
    1: "Step 1 of 3 - Platform Selection",
    2: "Step 2 of 3 - Website Configuration",
    3: "Step 3 of 3 - Installation",
  };

  $(".progress-text").text(stepTexts[currentStep]);
  $(".nav-info .current-step").text(`Step ${currentStep} of 3`);
}

// Update navigation buttons
function updateNavigation() {
  $("#prevBtn").prop("disabled", currentStep === 1);

  if (currentStep === 3) {
    $("#nextBtn").html('<i class="fas fa-rocket"></i>  Start Installation');
  } else {
    $("#nextBtn").html('Next <i class="fas fa-arrow-right"></i>');
  }

  updateNextButton();
}

// Update next button state
function updateNextButton() {
  const isValid = validateCurrentStep();
  $("#nextBtn").prop("disabled", !isValid);
}

// Update display
function updateDisplay() {
  updateStepDisplay();
  updateProgressBar();
  updateNavigation();
  updateSelectedPlatformDisplay();
  updateSummary();
}

// Start installation
function startInstallation() {
  // Simulate installation process
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
      // Complete previous step
      if (index > 0) {
        const prevStep = $(steps[index - 1].selector);
        prevStep.removeClass("active").addClass("completed");
        prevStep
          .find(".install-status i")
          .removeClass("fa-spinner fa-spin")
          .addClass("fa-check");
      }

      // Activate current step
      const currentStepEl = $(step.selector);
      currentStepEl.addClass("active");
      currentStepEl
        .find(".install-status i")
        .removeClass("fa-clock")
        .addClass("fa-spinner fa-spin");

      // Complete last step
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

          // Show success message
          showSuccessMessage();
        }, 2000);
      }
    }, step.delay);
  });
}

// Show success message
function showSuccessMessage() {
  const storeName = wizardData.storeInfo?.name || "Your Website";
  const storeUrl = wizardData.storeInfo?.url || "yourwebsite.com";

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

  // Reset wizard for new installation
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

// Global function for success message (needed for onclick)
window.closeSuccessMessage = closeSuccessMessage;
