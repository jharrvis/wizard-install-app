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
      desktop: null,
      mobile: null,
    },
  },
};

// Plugin data (loaded from JSON or fallback)
let pluginData = {};

// Add this flag to track if plugin data is loaded
let isPluginDataLoaded = false;

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

// Default plugin data structure
const defaultPluginData = {
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

// Popular Google Fonts list
const popularGoogleFonts = [
  "Open Sans",
  "Roboto",
  "Lato",
  "Montserrat",
  "Poppins",
  "Source Sans Pro",
  "Oswald",
  "Raleway",
  "Nunito",
  "Playfair Display",
  "Merriweather",
  "Ubuntu",
  "Roboto Condensed",
  "Roboto Slab",
  "PT Sans",
  "Noto Sans",
  "Libre Baskerville",
  "Crimson Text",
  "Work Sans",
  "Fira Sans",
  "Inter",
  "Rubik",
  "Quicksand",
  "Barlow",
  "Titillium Web",
  "Cabin",
  "Karla",
  "Oxygen",
  "Muli",
  "Dosis",
];

// Initialize wizard
$(document).ready(async function () {
  console.log("DOM Ready - Initializing wizard...");

  try {
    // Load plugin data first and wait for it
    await loadPluginData();

    // Then proceed with other initializations
    loadWizardData();
    initializeEventHandlers();
    updateDisplay();

    // Force populate store name field
    $("#storeName").val(wizardData.storeInfo.name);

    // Update button state
    updateNextButton();
  } catch (error) {
    console.error("Error during initialization:", error);
    // Use default plugin data if loading fails
    pluginData = defaultPluginData;
    renderPluginSections();
  }
});

// Load plugin data from JSON with better error handling
async function loadPluginData() {
  try {
    // Try with absolute path for Vercel
    const response = await fetch("/assets/data/plugins-data.json");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Validate the data structure
    if (data && typeof data === "object" && Object.keys(data).length > 0) {
      pluginData = data;
      isPluginDataLoaded = true;
      console.log("Plugin data loaded successfully:", pluginData);
    } else {
      throw new Error("Invalid plugin data structure");
    }

    renderPluginSections();
  } catch (error) {
    console.error("Error loading plugin data:", error);

    // Try alternative path
    try {
      const response = await fetch("./assets/data/plugins-data.json");
      if (response.ok) {
        const data = await response.json();
        if (data && typeof data === "object") {
          pluginData = data;
          isPluginDataLoaded = true;
          renderPluginSections();
          return;
        }
      }
    } catch (altError) {
      console.error("Alternative path also failed:", altError);
    }

    // Use fallback data
    pluginData = defaultPluginData;
    isPluginDataLoaded = true;
    renderPluginSections();
  }
}

// Render plugin sections with better error handling
function renderPluginSections() {
  const container = $("#pluginSections");
  container.empty();

  // Check if pluginData is valid
  if (
    !pluginData ||
    typeof pluginData !== "object" ||
    Object.keys(pluginData).length === 0
  ) {
    console.error("Invalid plugin data:", pluginData);
    container.html(
      '<p class="error-message">Unable to load plugin data. Please refresh the page.</p>'
    );
    return;
  }

  try {
    Object.entries(pluginData).forEach(([sectionKey, section]) => {
      // Validate section structure
      if (!section || !section.plugins || !Array.isArray(section.plugins)) {
        console.warn(`Invalid section structure for ${sectionKey}:`, section);
        return;
      }

      const sectionHtml = `
        <div class="plugin-section">
          <h3 class="plugin-section-title">${
            section.title || "Untitled Section"
          }</h3>
          <p class="plugin-section-description">${section.description || ""}</p>
          <div class="plugin-list">
            ${section.plugins
              .map((plugin) => {
                if (!plugin || !plugin.id) {
                  console.warn("Invalid plugin:", plugin);
                  return "";
                }

                return `
                  <div class="plugin-item ${
                    wizardData.plugins[plugin.id] ? "selected" : ""
                  }" data-plugin="${plugin.id}">
                    <div class="plugin-info">
                      <h4 class="plugin-name">${plugin.name || plugin.id}</h4>
                      <p class="plugin-description">${
                        plugin.description || ""
                      }</p>
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
                `;
              })
              .filter((html) => html !== "")
              .join("")}
          </div>
        </div>
      `;
      container.append(sectionHtml);
    });
  } catch (error) {
    console.error("Error rendering plugin sections:", error);
    container.html(
      '<p class="error-message">Error displaying plugins. Please refresh the page.</p>'
    );
  }
}

// Helper functions for plugins with better error handling
function checkIfPluginNeedsLicense(pluginId) {
  if (!pluginData || typeof pluginData !== "object") {
    return false;
  }

  for (const section of Object.values(pluginData)) {
    if (!section || !section.plugins || !Array.isArray(section.plugins)) {
      continue;
    }

    const plugin = section.plugins.find((p) => p && p.id === pluginId);
    if (plugin) {
      return plugin.needsLicense || false;
    }
  }
  return false;
}

function getPluginName(pluginId) {
  if (!pluginData || typeof pluginData !== "object") {
    return pluginId;
  }

  for (const section of Object.values(pluginData)) {
    if (!section || !section.plugins || !Array.isArray(section.plugins)) {
      continue;
    }

    const plugin = section.plugins.find((p) => p && p.id === pluginId);
    if (plugin) {
      return plugin.name || pluginId;
    }
  }
  return pluginId;
}

// Load data from localStorage with better error handling
function loadWizardData() {
  const savedData = localStorage.getItem("wizardData");

  if (savedData) {
    try {
      const parsed = JSON.parse(savedData);

      // Deep merge to preserve default structure
      wizardData = deepMerge(wizardData, parsed);

      // Ensure store name is not empty
      if (
        !wizardData.storeInfo?.name ||
        wizardData.storeInfo.name.trim() === ""
      ) {
        wizardData.storeInfo.name = "Sample Store";
      }

      // Ensure logos object exists
      if (!wizardData.styling.logos) {
        wizardData.styling.logos = {
          desktop: null,
          mobile: null,
        };
      }

      console.log("Loaded wizard data from localStorage:", wizardData);
    } catch (e) {
      console.error("Error parsing saved data:", e);
      // Keep default wizardData if parse fails
    }
  } else {
    console.log("No saved data found, using defaults");
  }

  // Save the data to ensure consistency
  saveWizardData();
  populateFormFields();
}

// Deep merge helper function
function deepMerge(target, source) {
  const output = Object.assign({}, target);

  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }

  return output;
}

function isObject(item) {
  return item && typeof item === "object" && !Array.isArray(item);
}

// Save data to localStorage
function saveWizardData() {
  try {
    localStorage.setItem("wizardData", JSON.stringify(wizardData));
  } catch (error) {
    console.error("Error saving wizard data:", error);
  }
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
  $(document).on("click", ".theme-card", function (e) {
    // Prevent double triggering from label click
    e.stopPropagation();
    const themeItem = $(this).closest(".theme-item");
    const selectedTheme = themeItem.data("theme");
    const radioInput = themeItem.find('input[name="theme-selection"]');

    if (radioInput.length > 0) {
      radioInput.prop("checked", true);
    }

    selectTheme(selectedTheme);
  });

  // Plugin toggles - only if plugin data is loaded
  $(document).on("change", ".plugin-checkbox", function () {
    if (!isPluginDataLoaded) {
      console.warn("Plugin data not loaded yet");
      return;
    }

    const pluginId = $(this).attr("id");
    const isChecked = $(this).is(":checked");
    const pluginNeedsLicense = checkIfPluginNeedsLicense(pluginId);

    if (isChecked && pluginNeedsLicense && !wizardData.licenseKeys[pluginId]) {
      const pluginName = getPluginName(pluginId);
      currentLicensePlugin = pluginId;
      openLicenseModal(pluginId, pluginName, true);
    } else {
      wizardData.plugins[pluginId] = isChecked;
      const pluginItem = $(this).closest(".plugin-item");
      if (isChecked) {
        pluginItem.addClass("selected");
      } else {
        pluginItem.removeClass("selected");
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
    updateNextButton();
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
  return wizardData.theme;
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

    // Ensure logos object exists
    if (!wizardData.styling.logos) {
      wizardData.styling.logos = {};
    }

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
  wizardData.styling.colors[colorType] = colorValue;
  saveWizardData();
  updateSummary();
}

function updateColorGuide() {
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

// Font functions// Search Google Fonts function
function searchGoogleFonts(query) {
  const suggestionsContainer = document.getElementById("fontSuggestions");

  if (!query || query.trim().length < 2) {
    suggestionsContainer.classList.remove("show");
    return;
  }

  const filteredFonts = popularGoogleFonts.filter((font) =>
    font.toLowerCase().includes(query.toLowerCase())
  );

  if (filteredFonts.length === 0) {
    suggestionsContainer.classList.remove("show");
    return;
  }

  let suggestionsHTML = "";
  filteredFonts.slice(0, 8).forEach((font) => {
    suggestionsHTML += `
      <div class="font-suggestion-item" onclick="selectGoogleFont('${font}')">
        <div class="font-suggestion-name">${font}</div>
        <div class="font-suggestion-preview" style="font-family: '${font}', sans-serif;">Sample Text</div>
      </div>
    `;
  });

  suggestionsContainer.innerHTML = suggestionsHTML;
  suggestionsContainer.classList.add("show");
}

// Select Google Font function
function selectGoogleFont(fontName) {
  const fontInput = document.getElementById("fontSearchInput");
  const suggestionsContainer = document.getElementById("fontSuggestions");

  fontInput.value = fontName;
  suggestionsContainer.classList.remove("show");

  // Load the font from Google Fonts
  loadGoogleFont(fontName);

  // Update the font in wizard data
  wizardData.styling.fonts = fontName;
  wizardData.styling.useDefaultFont = false;

  // Update preview
  updateFontPreview(fontName);

  saveWizardData();
  updateSummary();
}

// Load Google Font function
function loadGoogleFont(fontName) {
  const fontLink = document.createElement("link");
  fontLink.rel = "stylesheet";
  fontLink.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(
    /\s+/g,
    "+"
  )}:wght@300;400;500;600;700&display=swap`;

  // Check if font is already loaded
  const existingLink = document.querySelector(
    `link[href*="${fontName.replace(/\s+/g, "+")}"]`
  );
  if (!existingLink) {
    document.head.appendChild(fontLink);
  }
}

// Update font preview function
function updateFontPreview(fontName) {
  const previewText = document.getElementById("fontPreviewText");
  if (previewText) {
    previewText.style.fontFamily = `'${fontName}', sans-serif`;
  }
}

// Close suggestions when clicking outside
document.addEventListener("click", function (event) {
  const suggestionsContainer = document.getElementById("fontSuggestions");
  const fontSearchInput = document.getElementById("fontSearchInput");

  if (suggestionsContainer && fontSearchInput) {
    if (!event.target.closest(".font-search-container")) {
      suggestionsContainer.classList.remove("show");
    }
  }
});

// Update theme grid based on selected platform
function updateThemeGrid() {
  if (wizardData.platform === "magento") {
    $(".default-themes").hide();
    $(".magento-themes").show();

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

    if (
      !wizardData.theme ||
      wizardData.theme === "luma" ||
      wizardData.theme === "hyva"
    ) {
      selectTheme("default");
    }
  }

  // Update radio buttons to match selected theme
  setTimeout(() => {
    const radioInput = document.querySelector(
      `input[name="theme-selection"][value="${wizardData.theme}"]`
    );
    if (radioInput) {
      radioInput.checked = true;
    }

    document.querySelectorAll(".theme-item").forEach((item) => {
      item.classList.remove("selected");
    });
    const selectedThemeItem = document.querySelector(
      `.theme-item[data-theme="${wizardData.theme}"]`
    );
    if (selectedThemeItem) {
      selectedThemeItem.classList.add("selected");
    }
  }, 100);

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

// Theme selection functions
function selectTheme(themeName) {
  wizardData.theme = themeName;

  // Update radio buttons
  document
    .querySelectorAll('input[name="theme-selection"]')
    .forEach((radio) => {
      radio.checked = radio.value === themeName;
    });

  // Update visual indicators
  document.querySelectorAll(".theme-item").forEach((item) => {
    item.classList.remove("selected");
  });
  const selectedThemeItem = document.querySelector(
    `.theme-item[data-theme="${themeName}"]`
  );
  if (selectedThemeItem) {
    selectedThemeItem.classList.add("selected");
  }

  saveWizardData();
  updateSummary();
  updateNextButton();
}

// Sample data selection
function selectSampleData(sampleType) {
  wizardData.sampleData = sampleType;

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
    // Check if it's a popular Google Font
    const isGoogleFont = popularGoogleFonts.some(
      (font) => font.toLowerCase() === fontName.toLowerCase()
    );

    if (isGoogleFont) {
      loadGoogleFont(fontName);
      updateFontPreview(fontName);
    } else {
      // Use the font as-is (might be a system font)
      updateFontPreview(fontName);
    }

    wizardData.styling.fonts = fontName;
  } else {
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
    $("#licenseKeyInput").prop("required", true);
  } else {
    $("#licenseKeyInput").prop("required", false);
  }

  $("#licenseModal").addClass("show");
  $("body").addClass("modal-open");
}

function closeLicenseModal() {
  const isRequired = $("#licenseKeyInput").prop("required");

  if (isRequired && currentLicensePlugin) {
    // If user cancels, uncheck the plugin
    const checkbox = $(`#${currentLicensePlugin}`);
    checkbox.prop("checked", false);
    checkbox.closest(".plugin-item").removeClass("selected");
    delete wizardData.plugins[currentLicensePlugin];
    saveWizardData();
    updateSummary();
  }

  $("#licenseModal").removeClass("show");
  $("body").removeClass("modal-open");
  currentLicensePlugin = null;
  $("#licenseKeyInput").prop("required", false);
}

function saveLicenseKey() {
  const licenseKey = $("#licenseKeyInput").val().trim();

  if (!licenseKey) {
    alert("Please enter a license key");
    return;
  }

  if (currentLicensePlugin) {
    // Save the license key
    wizardData.licenseKeys[currentLicensePlugin] = licenseKey;
    wizardData.plugins[currentLicensePlugin] = true;

    // Keep the checkbox checked and plugin selected
    const checkbox = $(`#${currentLicensePlugin}`);
    checkbox.prop("checked", true);
    checkbox.closest(".plugin-item").addClass("selected");

    saveWizardData();
    updateSummary();

    // Close modal without unchecking
    $("#licenseModal").removeClass("show");
    $("body").removeClass("modal-open");
    currentLicensePlugin = null;
    $("#licenseKeyInput").prop("required", false);
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
  document.querySelectorAll(".theme-tab-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  if (event && event.target) {
    event.target.classList.add("active");
  } else {
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
  }

  // Version selection (must be called after platform to populate options)
  if (wizardData.platform && wizardData.version) {
    populateVersionSelect();
    $("#versionSelect").val(wizardData.version);
    showDependencies();
  }

  // Theme selection
  if (wizardData.theme) {
    selectTheme(wizardData.theme);
    // Ensure radio button is checked
    const themeRadio = document.querySelector(
      `input[name="theme-selection"][value="${wizardData.theme}"]`
    );
    if (themeRadio) {
      themeRadio.checked = true;
    }
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
    $("#useDefaultFont").prop("checked", wizardData.styling.useDefaultFont);
    toggleFontSelection();
    if (!wizardData.styling.useDefaultFont && wizardData.styling.fonts) {
      $("#fontSearchInput").val(wizardData.styling.fonts);
      updateCustomFont();
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
}

// Update summary
function updateSummary() {
  $("#summary-store-name").text(
    wizardData.storeInfo?.name || "Your Store Name"
  );
  $("#summary-version").text(wizardData.version || "N/A");
  $("#summary-selected-theme").text(
    wizardData.theme
      ? themePreviewData[wizardData.theme]?.name || wizardData.theme
      : "Luma (Default)"
  );

  // Sample data summary
  const sampleDataText =
    wizardData.sampleData === "with_sample"
      ? "Yes, using sample data"
      : "No, using own data";
  $("#summary-sample-data").text(sampleDataText);

  // Plugins summary
  const pluginsList = $("#summary-plugins");
  pluginsList.empty();

  const activePlugins = Object.keys(wizardData.plugins).filter(
    (pluginId) => wizardData.plugins[pluginId]
  );

  if (activePlugins.length > 0) {
    activePlugins.forEach((pluginId) => {
      const pluginName = getPluginName(pluginId);
      const hasLicense = wizardData.licenseKeys[pluginId];
      const licenseText = hasLicense ? " (Licensed)" : "";
      pluginsList.append(`<li>${pluginName}${licenseText}</li>`);
    });
  } else {
    pluginsList.append("<li>No plugins selected</li>");
  }

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
      result = true;
      console.log("Step 5 validation - Sample Data: true");
      break;
    case 6:
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
  // Save final configuration data
  const finalConfig = {
    timestamp: new Date().toISOString(),
    configuration: wizardData,
    platform: {
      name: wizardData.platform,
      version: wizardData.version,
      dependencies:
        platformData[wizardData.platform]?.versions[wizardData.version] || {},
    },
    activePlugins: Object.keys(wizardData.plugins)
      .filter((id) => wizardData.plugins[id])
      .map((id) => ({
        id: id,
        name: getPluginName(id),
        hasLicense: !!wizardData.licenseKeys[id],
        licenseKey: wizardData.licenseKeys[id] || null,
      })),
  };

  // Save to localStorage and potentially send to server
  localStorage.setItem("finalInstallationConfig", JSON.stringify(finalConfig));
  console.log("Final Installation Configuration:", finalConfig);

  // Show installation modal
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
      if (index > 0) {
        const prevStep = $(`#${steps[index - 1].id}`);
        prevStep.removeClass("active").addClass("completed");
        prevStep
          .find(".install-status i")
          .removeClass("fa-spinner fa-spin")
          .addClass("fa-check");
      }

      const currentStepEl = $(`#${step.id}`);
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

          $(".installation-steps").hide();
          $("#installationComplete").show();
          showSuccessMessage();
        }, 2000);
      }
    }, step.delay);
  });
}

// View website function
function viewWebsite() {
  const storeName = wizardData.storeInfo?.name || "Your Website";
  const finalConfig = localStorage.getItem("finalInstallationConfig");

  if (finalConfig) {
    console.log("Final configuration saved:", JSON.parse(finalConfig));
    // Here you could send the configuration to a server endpoint
    // Example:
    // fetch('/api/install', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: finalConfig
    // });
  }

  alert(`Opening ${storeName}...`);

  if (confirm("Would you like to create another website?")) {
    resetWizard();
  } else {
    $("#installationModal").removeClass("show");
    $("body").removeClass("modal-open");
  }
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
    .html('<i class="fas fa-external-link-alt"></i> Open Website');
}

// Close success message
function closeSuccessMessage() {
  $(".success-message, .overlay").remove();

  if (confirm("Would you like to create another website?")) {
    resetWizard();
  } else {
    $("#installationModal").removeClass("show");
    $("body").removeClass("modal-open");
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
    /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/i;
  return re.test(url);
}

// Real-time validation
$(document).ready(function () {
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
    .error-message {
        color: #ff7101;
        font-size: 1.6rem;
        text-align: center;
        padding: 2rem;
    }
  `
  )
  .appendTo("head");

// Close modal when clicking outside
document.addEventListener("click", function (event) {
  const themeModal = document.getElementById("themePreviewModal");
  const installationModal = document.getElementById("installationModal");

  if (themeModal && event.target === themeModal) {
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
window.updateColor = updateColor;
window.updateColorFromText = updateColorFromText;
window.updateFontFamily = updateFontFamily;
window.closeSuccessMessage = closeSuccessMessage;
window.openLicenseModal = openLicenseModal;
window.closeLicenseModal = closeLicenseModal;
window.saveLicenseKey = saveLicenseKey;
window.switchStyleTab = switchStyleTab;
window.getSelectedTheme = getSelectedTheme;
window.selectTheme = selectTheme;
window.selectSampleData = selectSampleData;
window.toggleFontSelection = toggleFontSelection;
window.updateCustomFont = updateCustomFont;
window.viewWebsite = viewWebsite;
window.searchGoogleFonts = searchGoogleFonts;
window.selectGoogleFont = selectGoogleFont;
