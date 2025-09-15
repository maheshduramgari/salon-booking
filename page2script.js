document.addEventListener("DOMContentLoaded", () => {
  const bookedSlotsTableBody = document.querySelector("#booked-slots-table tbody");
  const timeSlotContainer = document.querySelector(".time-slot-container");
  const modal = document.getElementById("confirmation-modal");
  const cancelModal = document.getElementById("cancel-modal");
  const selectedSlotDisplay = document.getElementById("selected-slot");
  const cancelSlotMessage = document.getElementById("cancel-slot-message");
  const confirmBtn = document.getElementById("confirm-btn");
  const cancelBtn = document.getElementById("cancel-btn");
  const confirmCancelBtn = document.getElementById("confirm-cancel-btn");
  const closeCancelBtn = document.getElementById("close-cancel-btn");
  const datePicker = document.getElementById("booking-date");

  const timeSlots = [
    "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM",
    "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
    "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM",
    "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM",
  ];

  let bookings = JSON.parse(localStorage.getItem("bookings")) || {};

  let selectedSlot = null;
  let selectedDate = null;

  function renderTimeSlots(date) {
    timeSlotContainer.innerHTML = "";
    const bookedSlots = bookings[date] || [];
    renderTable();
    timeSlots.forEach((slot) => {
      const slotDiv = document.createElement("div");
      slotDiv.classList.add("time-slot");
      slotDiv.setAttribute(
        "data-tooltip",
        bookedSlots.includes(slot) ? "Booked" : "Available"
      );

      if (bookedSlots.includes(slot)) {
        slotDiv.classList.add("booked");
        slotDiv.textContent = `${slot} (Booked)`;
        slotDiv.addEventListener("click", () => promptCancel(slot));
      } else {
        slotDiv.textContent = slot;
        slotDiv.addEventListener("click", () => selectSlot(slot, slotDiv));
      }
      timeSlotContainer.appendChild(slotDiv);
    });
  }

  function renderTable() {
    bookedSlotsTableBody.innerHTML = "";

    if (Object.keys(bookings).length === 0) {
      const noBookingsRow = document.createElement("tr");
      const noBookingsCell = document.createElement("td");
      noBookingsCell.colSpan = 4;
      noBookingsCell.textContent = "No bookings available.";
      noBookingsRow.appendChild(noBookingsCell);
      bookedSlotsTableBody.appendChild(noBookingsRow);
      return;
    }

    Object.keys(bookings).forEach((date) => {
      const bookedSlots = bookings[date];

      bookedSlots.forEach((slot) => {
        const row = document.createElement("tr");

        const dateCell = document.createElement("td");
        dateCell.textContent = date;
        row.appendChild(dateCell);

        const slotCell = document.createElement("td");
        slotCell.textContent = slot;
        row.appendChild(slotCell);

        const statusCell = document.createElement("td");
        statusCell.textContent = "Booked";
        row.appendChild(statusCell);

        bookedSlotsTableBody.appendChild(row);
      });
    });
  }

  function selectSlot(slot, element) {
    if (!selectedDate) {
      alert("Please select a date first.");
      return;
    }
    document.querySelectorAll(".time-slot").forEach((slotEl) => {
      slotEl.classList.remove("selected");
    });
    element.classList.add("selected");
    selectedSlot = slot;
    showModal(slot);
  }

  function showModal(slot) {
    selectedSlotDisplay.textContent = `You selected: ${slot} on ${selectedDate}`;
    modal.classList.remove("hidden");
  }

  function promptCancel(slot) {
    selectedSlot = slot;
    cancelSlotMessage.textContent = `Do you want to cancel booking for ${slot} on ${selectedDate}?`;
    cancelModal.classList.remove("hidden");
  }

  confirmBtn.addEventListener("click", () => {
    if (selectedSlot) {
      if (!bookings[selectedDate]) bookings[selectedDate] = [];
      bookings[selectedDate].push(selectedSlot);
      localStorage.setItem("bookings", JSON.stringify(bookings)); // Save bookings to localStorage
      alert(`Booking confirmed for ${selectedSlot} on ${selectedDate}!`);
      modal.classList.add("hidden");
      renderTimeSlots(selectedDate);
    }
  });

  cancelBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  confirmCancelBtn.addEventListener("click", () => {
    const index = bookings[selectedDate].indexOf(selectedSlot);
    if (index > -1) {
      bookings[selectedDate].splice(index, 1);
      localStorage.setItem("bookings", JSON.stringify(bookings)); // Save updated bookings to localStorage
      alert(`Booking for ${selectedSlot} on ${selectedDate} has been canceled.`);
      cancelModal.classList.add("hidden");
      renderTimeSlots(selectedDate);
    }
  });

  closeCancelBtn.addEventListener("click", () => {
    cancelModal.classList.add("hidden");
  });

  datePicker.addEventListener("change", (e) => {
    selectedDate = e.target.value;
    if (!selectedDate) {
      alert("Please select a valid date.");
      return;
    }
    renderTimeSlots(selectedDate);
  });

  renderTimeSlots(selectedDate);
});