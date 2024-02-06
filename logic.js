function getAllMonths(dateObj) {
  let allMonths = [];
  for (let i = 0; i < 12; i++) {
    dateObj.setMonth(i);
    allMonths.push(dateObj.toLocaleDateString(undefined, { month: "long" }));
  }
  let monthList = "";
  for (let i = 0; i < allMonths.length; i++) {
    monthList += `<option value=${i}> ${allMonths[i]}  </option>`;
  }
  return monthList;
}
// function to getDays without hardcode
// function getAllDays(dateObj) {
//   let myDays = "";
//   for (let i = 1; i <= 7; i++) {
//     dateObj.setDate(i);
//     myDays += `<option> ${dateObj.toLocaleDateString(undefined, {
//       weekday: "long",
//     })} </option>`;
//   }
//   return myDays;
// }

function getAllYear(dateObj) {
  let startYear = dateObj.getFullYear() - 10;
  let endYear = dateObj.getFullYear() + 10;
  let yearOptions;
  for (let i = startYear; i < endYear; i++) {
    yearOptions += `<option value=${i}> ${i}  </option>`;
  }
  return yearOptions;
}

// not working
// function updateEvent(event, eventList, id) {
//   console.log(eventList[id]);
//   if (event.target.tagName === 'SPAN' && event.target.getAttribute('data-toggle') !== 'modal') {
//     event.target.setAttribute("data-toggle", "modal");
//     event.target.setAttribute("data-target", "#filledModal");
//     event.stopPropagation();
//   }
// }

function getEventsList(myDate) {
  let eventList = JSON.parse(localStorage.getItem(myDate));
  let data = "";
  for (const id in eventList) {
    data += `<span class='eventStyle' onclick='updateEvent(event, ${JSON.stringify(
      eventList
    )}, ${id})'>${eventList[id].title}</span>`;
  }
  return data;
}

function createCalendar(year, month) {
  let d = new Date(year, month);

  let table =
    "<table class='table'><thead><tr><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th><th>Sun</th></tr><tr class='bg-primary'></thead>";

  // from Monday till the first day of the month
  // * * * 1  2  3  4
  for (let i = 0; i < getDay(d); i++) {
    table += "<td></td>";
  }

  // <td> with actual dates
  while (d.getMonth() == month) {
    let myDate = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
    table += `<td data-toggle='modal' data-target='#exampleModal' data-value='${myDate}'
    onclick="$(this).attr('id', 'active')"><div><span>${d.getDate()} </span></div>
    <div class="d-flex flex-column p-1">
    ${getEventsList(myDate)}
    </div>
    </td>`;

    if (getDay(d) % 7 == 6) {
      // sunday, last day of week - newline
      table += "</tr><tr>";
    }

    d.setDate(d.getDate() + 1);
  }

  // add spaces after last days of month for the last row
  // 29 30 31 * * * *
  if (getDay(d) != 0) {
    for (let i = getDay(d); i < 7; i++) {
      table += "<td></td>";
    }
  }
  // close the table
  table += "</tr></table>";
  return table;
}

function getDay(date) {
  // get day number from 0 (monday) to 6 (sunday)
  let day = date.getDay();
  if (day == 0) day = 7; // make Sunday (0) the last day
  return day - 1;
}

$(document).ready(function () {
  let yearOptions = "",
    monthOptions = "";
  yearOptions = getAllYear(new Date());
  monthOptions = getAllMonths(new Date());

  $("#year").html(yearOptions);
  $("#month").html(monthOptions);

  // get Datys without hardcode
  // $("#days").html(getAllDays(new Date()));

  $("#calender").html(
    createCalendar(
      $("#year").find(":selected").val(),
      $("#month").find(":selected").val()
    )
  );
  $("#year, #month").change(function () {
    $("#calender").html(
      createCalendar(
        $("#year").find(":selected").val(),
        $("#month").find(":selected").val()
      )
    );
  });

  $("#saveButton").click(function () {
    let currDate = $("#active").data("value");
    $("#active").removeAttr("id");

    let prevValue = localStorage.getItem(currDate)
      ? JSON.parse(localStorage.getItem(currDate))
      : {};

    let eventNum = Object.keys(prevValue).length + 1;
    let eventTitle = $("#eventName").val();
    let eventDes = $("#description").val();

    // convert 24 hours format into 12 hours
    let eventTime = $("#timeStamp").val();

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

    $("#calender").html(
      createCalendar(
        $("#year").find(":selected").val(),
        $("#month").find(":selected").val()
      )
    );
  });

  // unable to detect changes in localstorage
  // window.addEventListener(
  //   "storage",
  //   function (event) {
  //     if (event.originalEvent.StorageArea === localStorage) {
  //       alert("thier is update in localStorage");
  //     }
  //     alert("hello");
  //     console.log("change detected");
  //   },
  //   false
  // );
});

// localStorage.clear();