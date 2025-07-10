// Enhanced Website Creation Wizard JavaScript - 6 Steps

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
    logos: {
      // Ensure logos property exists
      desktop: null,
      mobile: null,
    },
  },
};

// Plugin data (loaded from JSON or fallback)
let pluginData = {};

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

// Initialize wizard
$(document).ready(function () {
  console.log("DOM Ready - Initializing wizard...");

  loadPluginData();
  loadWizardData();
  initializeEventHandlers();
  updateDisplay();

  // Force populate store name field
  $("#storeName").val(wizardData.storeInfo.name);

  // Multiple attempts to ensure button is enabled
  updateNextButton();

  setTimeout(() => {
    console.log("Second attempt to update button...");
    updateNextButton();
  }, 100);

  setTimeout(() => {
    console.log("Third attempt to update button...");
    updateNextButton();
  }, 500);
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

  if (!pluginData || typeof pluginData !== "object") {
    console.error("Invalid plugin data:", pluginData);
    return;
  }

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
              wizardData.plugins[plugin.id] ? "selected" : ""
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
                wizardData.plugins[plugin.id] ? "checked" : ""
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

  // Save the data to ensure consistency (e.g., if defaults were applied)
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
  $(".platform-card").on("click", function () {
    const platform = $(this).data("platform");
    selectPlatform(platform);
  });

  // Version selection
  $("#versionSelect").on("change", function () {
    const version = $(this).val();
    wizardData.version = version;
    saveWizardData();

    if (version) {
      showDependencies();
    } else {
      $("#dependenciesDisplay").removeClass("show");
    }
    updateNextButton();
  });

  // Navigation buttons
  $("#nextBtn").on("click", function () {
    if (currentStep < 6) {
      nextStep();
    } else {
      startInstallation();
    }
  });

  $("#prevBtn").on("click", function () {
    if (currentStep > 1) {
      prevStep();
    }
  });

  // Store name input
  $("#storeName").on("input", function () {
    const storeName = $(this).val().trim();
    wizardData.storeInfo = wizardData.storeInfo || {};
    wizardData.storeInfo.name = storeName;
    saveWizardData();
    updateSummary();
    updateNextButton();
  });

  // Theme selection
  $(document).on("click", ".theme-card", function () {
    const selectedTheme = $(this).data("theme");
    selectTheme(selectedTheme);
  });

  // Plugin toggles
  $(document).on("change", ".plugin-checkbox", function () {
    const pluginId = $(this).attr("id");
    const isChecked = $(this).is(":checked");
    const pluginNeedsLicense = checkIfPluginNeedsLicense(pluginId);

    if (isChecked && pluginNeedsLicense && !wizardData.licenseKeys[pluginId]) {
      // If plugin needs license and no key is present, open modal
      const pluginName = getPluginName(pluginId);
      openLicenseModal(pluginId, pluginName, true);
    } else {
      // Otherwise, just update the state
      wizardData.plugins[pluginId] = isChecked;
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
    }
  });

  // Sample data selection
  $('input[name="sample-data"]').on("change", function () {
    wizardData.sampleData = $(this).val();
    saveWizardData();
    updateSummary();
    updateNextButton(); // Added to update button if sample data selection affects validation
  });

  // Color pickers and text inputs for colors
  $("#primaryColorPicker, #secondaryColorPicker, #tertiaryColorPicker").on(
    "input",
    function () {
      updateColor($(this).attr("id").replace("ColorPicker", ""));
    }
  );
  $("#primaryColorValue, #secondaryColorValue, #tertiaryColorValue").on(
    "input",
    function () {
      updateColorFromText($(this).attr("id").replace("ColorValue", ""));
    }
  );

  // Font selection
  $("#useDefaultFont").on("change", function () {
    toggleFontSelection();
  });
  $("#fontSearchInput").on("input", function () {
    updateCustomFont();
  });
  $("#fontFamilySelect").on("change", function () {
    updateFontFamily();
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
  return wizardData.theme; // Rely on wizardData.theme as the source of truth
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

    wizardData.styling.logos[type] = e.target.result;
    saveWizardData();
    updateSummary();
  };
  reader.readAsDataURL(file);
}

// Color functions (consolidated)
function updateColor(colorType) {
  const picker = document.getElementById(`${colorType}ColorPicker`);
  const value = document.getElementById(`${colorType}ColorValue`);

  value.value = picker.value;
  saveColorToWizardData(colorType, picker.value);
  updateColorGuide(); // Update color guide visually
}

function updateColorFromText(colorType) {
  const picker = document.getElementById(`${colorType}ColorPicker`);
  const value = document.getElementById(`${colorType}ColorValue`);

  if (/^#[0-9A-F]{6}$/i.test(value.value)) {
    picker.value = value.value;
    saveColorToWizardData(colorType, value.value);
    updateColorGuide(); // Update color guide visually
  }
}

function saveColorToWizardData(colorType, colorValue) {
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

  wizardData.styling.fonts = selectedFont;
  saveWizardData();
  updateSummary();
}

// Update theme grid based on selected platform
function updateThemeGrid() {
  if (wizardData.platform === "magento") {
    $(".default-themes").hide();
    $(".magento-themes").show();

    // Set default theme for Magento if none selected or if it's a non-magento default
    if (
      !wizardData.theme ||
      wizardData.theme === "default" ||
      wizardData.theme === "ecommerce"
    ) {
      selectTheme("luma");
    }
  } else {
    $(".default-themes").show();
    $(".magento-themes").hide();

    // Set default theme for other platforms if none selected or if it's a magento theme
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
    document
      .querySelectorAll(".theme-card")
      .forEach((card) => card.classList.remove("selected"));
    const selectedThemeCard = document.querySelector(
      `[data-theme="${wizardData.theme}"]`
    );
    if (selectedThemeCard) {
      selectedThemeCard.classList.add("selected");
    }
  }, 100); // Small delay to ensure elements are rendered before selecting

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
  document.querySelectorAll(".theme-card").forEach((item) => {
    item.classList.remove("selected");
  });
  const selectedThemeCard = document.querySelector(
    `[data-theme="${themeName}"]`
  );
  if (selectedThemeCard) {
    selectedThemeCard.classList.add("selected");
  }

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
  const selectedSampleItem = document.querySelector(
    `[data-sample="${sampleType}"]`
  );
  if (selectedSampleItem) {
    selectedSampleItem.classList.add("selected");
  }

  saveWizardData();
  updateSummary();
  updateNextButton();
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
  } else {
    // If input is cleared, revert to 'default' font (Montserrat)
    wizardData.styling.fonts = "default";
    document.getElementById("fontPreviewText").style.fontFamily = "Montserrat";
  }
  saveWizardData();
  updateSummary();
}

// License modal functions
function openLicenseModal(pluginId, pluginName, isRequired = false) {
  currentLicensePlugin = pluginId;
  $("#licenseModalTitle").text(`Enter License Key for ${pluginName}`);
  $("#licenseKeyInput").val(wizardData.licenseKeys[pluginId] || "");

  if (isRequired) {
    $("#licenseKeyInput").prop("required", true); // Use .prop() for boolean attributes
  } else {
    $("#licenseKeyInput").prop("required", false);
  }

  $("#licenseModal").addClass("show");
  $("body").addClass("modal-open");
}

function closeLicenseModal() {
  const isRequired = $("#licenseKeyInput").prop("required"); // Use .prop()

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
  $("#licenseKeyInput").prop("required", false); // Reset required state
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

function switchThemeTab(tabName, event) {
  // Pass event object
  document.querySelectorAll(".theme-tab-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  if (event && event.target) {
    event.target.classList.add("active");
  } else {
    // Fallback if event is not passed (e.g., direct call)
    document
      .querySelector(`.theme-tab-btn[onclick*="${tabName}"]`)
      .classList.add("active");
  }

  document.querySelectorAll(".theme-tab-content").forEach((content) => {
    content.classList.remove("active");
  });

  if (tabName === "preview") {
    document.getElementById("previewTab").classList.add("active");
  } else if (tabName === "styling") {
    document.getElementById("stylingTab").classList.add("active");
  }
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
    // updateThemeGrid() is called within selectPlatform
  }

  // Version selection (must be called after platform to populate options)
  if (wizardData.platform && wizardData.version) {
    populateVersionSelect(); // Ensure dropdown is populated
    $("#versionSelect").val(wizardData.version);
    showDependencies();
  }

  // Theme selection
  if (wizardData.theme) {
    selectTheme(wizardData.theme); // This will also update the visual selection
  }

  // Sample data
  if (wizardData.sampleData) {
    selectSampleData(wizardData.sampleData); // This will also update the visual selection
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
    updateColorGuide(); // Call to update the visual swatches
  }

  // Fonts
  if (wizardData.styling) {
    $("#useDefaultFont").prop("checked", wizardData.styling.useDefaultFont);
    toggleFontSelection(); // Call to show/hide custom font input
    if (!wizardData.styling.useDefaultFont && wizardData.styling.fonts) {
      $("#fontSearchInput").val(wizardData.styling.fonts);
      updateCustomFont(); // Apply custom font if not using default
    } else if (wizardData.styling.useDefaultFont) {
      document.getElementById("fontPreviewText").style.fontFamily =
        "Montserrat";
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

  // Update plugin states after rendering (already handled by renderPluginSections)
  // No need for setTimeout here if renderPluginSections correctly initializes checkboxes based on wizardData
}

// Update summary
function updateSummary() {
  $("#summary-store-name").text(
    wizardData.storeInfo?.name || "Your Store Name"
  ); // Changed 'a' to a more descriptive default
  $("#summary-version").text(wizardData.version || "N/A"); // Default version if not selected
  $("#summary-selected-theme").text(
    wizardData.theme
      ? themePreviewData[wizardData.theme]?.name || wizardData.theme
      : "Luma (Default)"
  ); // More descriptive theme name

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
      $("#summary-fonts").text(wizardData.styling.fonts || "Custom Font"); // Display actual custom font name
    }
  }
}

// Navigation functions
function nextStep() {
  if (validateCurrentStep()) {
    currentStep++;
    updateStepDisplay();
    updateProgressBar();
    updateNavigation();
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
      // Step 1: Store Name must not be empty
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
      // Step 2: Platform and Version must be selected
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
      // Step 3: Theme must be selected. Default theme ensures this is always true if a default is set.
      result = wizardData.theme && wizardData.theme !== "";
      console.log(
        "Step 3 validation - Theme:",
        wizardData.theme,
        "Result:",
        result
      );
      break;
    case 4:
      // Step 4: Plugins - ensure any required license keys are present for enabled plugins
      let pluginsValid = true;
      for (const pluginId in wizardData.plugins) {
        if (
          wizardData.plugins[pluginId] &&
          checkIfPluginNeedsLicense(pluginId) &&
          !wizardData.licenseKeys[pluginId]
        ) {
          pluginsValid = false;
          break;
        }
      }
      result = pluginsValid;
      console.log("Step 4 validation - Plugins valid:", result);
      break;
    case 5:
      // Step 5: Sample Data - always valid as there's always a default
      result = true;
      console.log("Step 5 validation - Sample Data: true");
      break;
    case 6:
      // Step 6: Summary - always valid
      result = true;
      console.log("Step 6 validation - Summary: true");
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

  updateNextButton(); // Ensure next button state is correctly set after HTML change
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
      cursor: "pointer",
      background: "#ff7101",
    });
    console.log("Button enabled");
  } else {
    nextBtn.prop("disabled", true);
    nextBtn.addClass("disabled");
    nextBtn.css({
      opacity: "0.5",
      "pointer-events": "none",
      cursor: "not-allowed",
      background: "#cccccc",
    });
    console.log("Button disabled");
  }

  console.log("Button final state - disabled:", nextBtn.prop("disabled"));
  console.log("=== End Debug ===");
}

// Update display (main render function)
function updateDisplay() {
  updateStepDisplay();
  updateProgressBar();
  updateNavigation();
  updateSummary();
}

// Start installation with modal
function startInstallation() {
  $("#installationModal").addClass("show");
  $("body").addClass("modal-open");

  const steps = [
    {
      id: "downloadStep",
      delay: 1000,
    },
    {
      id: "databaseStep",
      delay: 3000,
    },
    {
      id: "configStep",
      delay: 5000,
    },
    {
      id: "completeStep",
      delay: 7000,
    },
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
          showSuccessMessage(); // Call the unified success message
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

// Show success message (unified function for both `startInstallation` and `closeSuccessMessage` logic)
function showSuccessMessage() {
  const storeName = wizardData.storeInfo?.name || "Your Website";
  const storeUrl = "yourwebsite.com"; // Placeholder

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
            <p><strong>Website URL:</strong> <a href="https://${storeUrl}" target="_blank">https://${storeUrl}</a></p>
            <p><strong>Admin Panel:</strong> <a href="https://${storeUrl}/admin" target="_blank">https://${storeUrl}/admin</a></p>
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
  $("#nextBtn")
    .prop("disabled", false)
    .html('<i class="fas fa-external-link-alt"></i> Open Website'); // Re-enable button after installation
}

// Close success message
function closeSuccessMessage() {
  $(".success-message, .overlay").remove();

  if (confirm("Would you like to create another website?")) {
    resetWizard();
  } else {
    // Optionally close the installation modal if not resetting
    $("#installationModal").removeClass("show");
    $("body").removeClass("modal-open");
  }
}

// Reset wizard
function resetWizard() {
  localStorage.removeItem("wizardData");
  location.reload();
}

// Form validation helpers (kept as is)
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validatePassword(password) {
  return password.length >= 8;
}

function validateUrl(url) {
  // A more robust URL validation regex for domain names
  const re =
    /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/i;
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

// Add error styles (kept as is)
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
  const installationModal = document.getElementById("installationModal"); // Added for installation modal

  if (themeModal && event.target === themeModal) {
    closeThemePreview();
  }
  // Allow installation modal to be closed by clicking outside only if not in the middle of installation animation
  // The original code uses a general 'show' class which might need refinement if specific close behaviors are desired
  if (
    installationModal &&
    event.target === installationModal &&
    !$("#installationComplete").is(":visible")
  ) {
    // Only close if installation is not complete (i.e., not showing success message yet)
    // The startInstallation function already handles hiding the modal once complete.
    // For manual closing, this would be needed.
    // But given the UX, the success message handles closing.
    // So, this part might not be strictly necessary if the flow is well-controlled.
  }
});

// Close modal with Escape key
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closeThemePreview();
    closeLicenseModal();
    // Potentially close installation modal, but depends on UX flow
    if (
      $("#installationModal").hasClass("show") &&
      !$("#installationComplete").is(":visible")
    ) {
      // $("#installationModal").removeClass("show");
      // $("body").removeClass("modal-open");
    }
  }
});

// Make functions global for onclick handlers (ensure all used functions are global)
window.openThemePreview = openThemePreview;
window.closeThemePreview = closeThemePreview;
window.switchThemeTab = switchThemeTab;
window.handleLogoUpload = handleLogoUpload;
window.updateColor = updateColor; // Consolidated function
window.updateColorFromText = updateColorFromText; // Consolidated function
window.updateFontFamily = updateFontFamily; // Changed name for consistency
window.closeSuccessMessage = closeSuccessMessage;
window.openLicenseModal = openLicenseModal;
window.closeLicenseModal = closeLicenseModal;
window.saveLicenseKey = saveLicenseKey;
window.switchStyleTab = switchStyleTab;
window.getSelectedTheme = getSelectedTheme; // Returns wizardData.theme directly
window.selectTheme = selectTheme;
window.selectSampleData = selectSampleData;
window.toggleFontSelection = toggleFontSelection;
window.updateCustomFont = updateCustomFont;
window.viewWebsite = viewWebsite;
// Removed redundant updateColorValue and updateColorPicker from global as they are now consolidated into updateColor/updateColorFromText
// Removed redundant saveColorSettings, updateFontPreview from global as their logic is handled in the consolidated functions.
