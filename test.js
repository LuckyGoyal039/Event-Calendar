function getAllMonths() {
  const allMonths = Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setMonth(i);
    return date.toLocaleDateString(undefined, { month: "long" });
  });

  return allMonths
    .map((month, index) => `<option value="${index}">${month}</option>`)
    .join("");
}

function getAllYear() {
  const dateObj = new Date();
  const startYear = dateObj.getFullYear() - 10;
  const endYear = dateObj.getFullYear() + 10;
  const yearOptions = Array.from({ length: endYear - startYear }, (_, i) => {
    const year = startYear + i;
    return `<option value="${year}">${year}</option>`;
  }).join("");

  return yearOptions;
}

function createCalendar(year, month) {
  const d = new Date(year, month);
  const firstDayOfWeek = (d.getDay() + 6) % 7; // Adjust for Monday being the first day of the week

  const tableRows = [];
  let currentRow = "";

  while (d.getMonth() === month) {
    const currentDate = d.toLocaleDateString("en-GB");

    if (d.getDay() === firstDayOfWeek) {
      if (currentRow) tableRows.push(`<tr>${currentRow}</tr>`);
      currentRow = "";
    }

    currentRow += `<td data-value="${currentDate}">
        <div>
          <span>${d.getDate()}</span>
        </div>
        <div class="d-flex flex-column p-1">
          ${getEventsList(currentDate)}
        </div>
      </td>`;

    d.setDate(d.getDate() + 1);
  }

  if (currentRow) tableRows.push(`<tr>${currentRow}</tr>`);

  return `<table class="table">
      <thead>
        <tr>
          <th>Mon</th><th>Tue</th><th>Wed</th>
          <th>Thu</th><th>Fri</th><th>Sat</th><th>Sun</th>
        </tr>
      </thead>
      <tbody>${tableRows.join("")}</tbody>
    </table>`;
}

function getEventsList(myDate) {
  const eventList = JSON.parse(localStorage.getItem(myDate)) || {};
  return Object.entries(eventList)
    .map(([id, event]) => {
      return `<span id="${myDate + "_active"}" key="${id}" class="eventStyle">${
        event.title
      }</span>`;
    })
    .join("");
}

$(document).ready(function () {
  const yearOptions = getAllYear();
  const monthOptions = getAllMonths();

  $("#year").html(yearOptions);
  $("#month").html(monthOptions);

  function updateCalendar() {
    const year = $("#year").val();
    const month = $("#month").val();
    $("#calender").html(createCalendar(year, month));
  }

  $("#year, #month").change(updateCalendar);
  updateCalendar();

  $(document).on("dblclick", "td", function () {
    $("#exampleModal").modal("show");
    $(this).attr("id", "active");
  });

  $(document).on("click", "td", function () {
    $(this).attr("id", "active");
  });

  $(document).on("click", ".eventStyle", function () {
    $("#filledModal").modal("show");
  });

  $("#saveButton").click(function () {
    const currDate = $("#active").data("value");
    $("#active").removeAttr("id");

    const prevValue = JSON.parse(localStorage.getItem(currDate)) || {};
    const eventNum = Object.keys(prevValue).length + 1;
    const eventTitle = $("#eventName").val();
    const eventDes = $("#description").val();
    const eventTime = $("#timeStamp").val();

    const newEvent = {
      title: eventTitle,
      description: eventDes,
      timeStamp: eventTime,
    };

    localStorage.setItem(
      currDate,
      JSON.stringify({
        ...prevValue,
        [eventNum]: newEvent,
      })
    );

    $("#exampleModal").modal("hide");
    $("#eventName").val("");
    $("#description").val("");
    $("#timeStamp").val("");

    updateCalendar();
  });

  $("#deleteButton").click(function () {
    const currDate = $("#active").data("value");
    const myObj = JSON.parse(localStorage.getItem(currDate)) || {};
    const eventId = $(`#${currDate}_active`).attr("key");
    delete myObj[eventId];
    localStorage.setItem(currDate, JSON.stringify(myObj));

    $("#filledModal").modal("hide");
    updateCalendar();
  });

  $("#updateButton").click(function () {
    const currDate = $("#active").data("value");
    const myObj = JSON.parse(localStorage.getItem(currDate)) || {};
    const eventId = $(`#${currDate}_active`).attr("key");
    const eventTitle = $("#eventNameFilled").val();
    const eventDes = $("#descriptionFilled").val();
    const eventTime = $("#timeStampFilled").val();

    myObj[eventId] = {
      title: eventTitle,
      description: eventDes,
      timeStamp: eventTime,
    };

    localStorage.setItem(currDate, JSON.stringify(myObj));

    $("#filledModal").modal("hide");
    updateCalendar();
  });
});
