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

function getAllYear(dateObj) {
  let startYear = dateObj.getFullYear() - 10;
  let endYear = dateObj.getFullYear() + 10;
  let yearOptions;
  for (let i = startYear; i < endYear; i++) {
    yearOptions += `<option value=${i}> ${i}  </option>`;
  }
  return yearOptions;
}

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

function createCalendar(year, month) {
  let d = new Date(year, month);

  let table =
    "<table class='table'><thead><tr><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th><th>Sun</th></tr><tr></thead>";

  // from Monday till the first day of the month
  // * * * 1  2  3  4
  for (let i = 0; i < getDay(d); i++) {
    table += "<td></td>";
  }

  // <td> with actual dates
  while (d.getMonth() == month) {
    table += `<td data-toggle='modal' data-target='#exampleModal' data-value='${
      d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate()
    }'
    onclick="$(this).attr('id', 'active')">${d.getDate()} 
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
    // alert(currDate);
    prevValue = localStorage.getItem(currDate)
      ? localStorage.getItem(currDate)
      : {};
    console.log("prev", prevValue);

    eventNum = Object.keys(prevValue).length + 1;
    eventTitle = $("#eventName").val();
    eventDes = $("#description").val();
    // console.log(eventDes)

    const newEvent = {};
    newEvent[eventNum] = { title: eventTitle, description: eventDes };
    localStorage.setItem(
      currDate,
      JSON.stringify({
        ...prevValue,
        ...newEvent,
      })
    );
    $("#exampleModal").modal("hide");
    $("#eventName").val("");
    $("#description").val("");
  });
});

localStorage.clear();
