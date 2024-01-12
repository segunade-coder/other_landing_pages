const checkIfEmpty = (...values) => {
  let array_of_errors = [];
  values.forEach((value, i) => {
    if (value) {
      if (typeof value === "string") {
        if (value === "" || value === null || value === undefined) {
          array_of_errors.push(true);
        }
      }
      if (typeof value === "object") {
        for (const key in value) {
          if (
            value[key] === "" ||
            value[key] === null ||
            value[key] === undefined
          ) {
            array_of_errors.push(`${key} is required`);
          }
        }
      }
    } else {
      array_of_errors.push(true);
    }
  });
  return array_of_errors;
};

document
  .getElementById("contactForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const firstName = document.getElementById("first_name").value;
    const lastName = document.getElementById("last_name").value;
    const schoolName = document.getElementById("school_name").value;
    const schoolRange = document.getElementById("capacity_ranges").value;
    const referralSource = document.getElementById("referral_source").value;
    const desiredResult = document.getElementById("desired_results").value;
    const isEmpty = checkIfEmpty(
      { "First Name": firstName },
      { "Last Name": lastName },
      { "School Name": schoolName },
      { "School Range": schoolRange },
      { Referral: referralSource },
      { "Desired Output": desiredResult }
    );
    if (isEmpty.length > 0) {
      return alert(isEmpty[0]);
    } else {
      fetch("rep", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          firstName,
          lastName,
          schoolName,
          referralSource,
          schoolRange,
          desiredResult,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status) {
            alert(data.message);
            location.href = `schedule?id=${data.data}`;
          } else {
            alert(
              typeof data.message === "object"
                ? "Unable to submit data"
                : data.message
            );
            console.log(data.message);
          }
          // Additional actions after form submission if needed
        })
        .catch((error) => console.error("Error:", error));
    }
  });
