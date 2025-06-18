window.onload = function () {
  // Populate fields from URL
  const urlParams = new URLSearchParams(window.location.search);
  const from = urlParams.get('from');
  const to = urlParams.get('to');
  const depart = urlParams.get('depart');
  const ret = urlParams.get('return');
  const tripType = urlParams.get('tripType');
  const passengers = urlParams.get('passengers');

  if (from) document.getElementById("from").value = from;
  if (to) document.getElementById("to").value = to;
  if (depart) document.getElementById("depart").value = depart;
  if (ret) document.getElementById("return").value = ret;
  if (tripType) document.getElementById("trip").value = tripType;
  if (passengers) document.getElementById("passengers").value = passengers;

  const fromCity = from?.split(",")[0].trim() || "From";
  const toCity = to?.split(",")[0].trim() || "To";

  const departFormatted = formatDate(depart);
  const returnFormatted = formatDate(ret);

  document.getElementById("onward-route").textContent = `${fromCity} → ${toCity}`;
  document.getElementById("return-route").textContent = `${toCity} → ${fromCity}`;
  document.getElementById("onward-title").textContent = `Flights from ${fromCity} to ${toCity}, ${departFormatted}`;
  document.getElementById("return-title").textContent = `${toCity} to ${fromCity}, ${returnFormatted}`;

  // Dynamically assign data-* attributes to each flight card
  document.querySelectorAll(".flight-card").forEach(card => {
    const airlineName = card.querySelector(".airline-name")?.textContent.trim().toLowerCase() || "";
    card.setAttribute("data-airline", airlineName);

    const stopsText = card.querySelector(".stops")?.textContent.trim().toLowerCase() || "";
    const stops = stopsText.includes("non stop") ? "nonstop" : "onestop";
    card.setAttribute("data-stops", stops);

    const isRefundable = card.innerHTML.toLowerCase().includes("refundable");
    card.setAttribute("data-refundable", isRefundable ? "true" : "false");

    const priceText = card.querySelector(".price")?.textContent.replace(/[^\d]/g, "");
    card.setAttribute("data-price", priceText);
  });

  // Attach filter checkbox listeners
  document.querySelectorAll(".filter").forEach(filter => {
    filter.addEventListener("change", applyFilters);
  });

  // Attach price slider listener
  const priceSlider = document.getElementById("priceFilter");
  const priceValue = document.getElementById("priceValue");

  priceValue.textContent = `₹${priceSlider.value}`;

  priceSlider.addEventListener("input", () => {
    priceValue.textContent = `₹${priceSlider.value}`;
    applyFilters();
  });

  // Initial filter on load
  applyFilters();
};

function formatDate(dateStr) {
  if (!dateStr) return "";
  const dateObj = new Date(dateStr);
  const options = { weekday: 'short', day: '2-digit', month: 'short' };
  return dateObj.toLocaleDateString('en-GB', options);
}

function applyFilters() {
  const filters = Array.from(document.querySelectorAll(".filter:checked"))
    .map(el => el.dataset.filter.toLowerCase());

  const maxPrice = parseInt(document.getElementById("priceFilter").value);

  document.querySelectorAll(".flight-card").forEach(card => {
    const airline = card.dataset.airline?.toLowerCase() || "";
    const stops = card.dataset.stops?.toLowerCase() || "";
    const refundable = card.dataset.refundable === "true";
    const price = parseInt(card.dataset.price) || 0;

    const matchesFilters = filters.every(f =>
      airline.includes(f) ||
      (f === "nonstop" && stops === "nonstop") ||
      (f === "refundable" && refundable)
    );

    const matchesPrice = price <= maxPrice;

    card.style.display = (matchesFilters || filters.length === 0) && matchesPrice ? "block" : "none";
  });
}

