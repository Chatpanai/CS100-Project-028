const config = {
  backendUrl: "http://localhost:8000/", // Default backend URL
};
const port = 8000;

//menu pop up
function menuPopUp() {
  const navigationMenu = document.querySelector('.menu_popup');
  navigationMenu.classList.toggle('show');
}

//result popup
function resultPopUp() {
  if (!validateName() || !validateStudentID() || !validateEmail() || !workTitleInput() || !academicYearInput() || !semesterInput() || !validateDateInputs() ){
    return;
  }
  const navigationMenu = document.querySelector('.result');
  navigationMenu.classList.toggle('show');
}

// Function to validate Firstname and Lastname
function validateName() {
  const fullnameInput = document.getElementById("fullname");
  const names = fullnameInput.value.trim().split(" ");
  const errorElement = document.getElementById("fullnameError");
  const hideName = document.getElementById("nameDisappear");

  if(names.length !== 0){
    hideName.style.display = "none";
  }
  if (names.length !== 2) {
    errorElement.textContent = "Please enter both your Firstname and Lastname";
    return false;
  } else {
    errorElement.textContent = ""; // Clear the error message when valid
  }
  return true;
}

// Function to validate Student ID
function validateStudentID() {
  const studentIDInput = document.getElementById("studentID");
  const studentIDPattern = /^6[1-6]\d{8}$/;
  const errorElement = document.getElementById("studentIDError");
  const hideStuID = document.getElementById("stuIdDisappear");

  if(studentIDInput.length !== 0){
    hideStuID.style.display = "none";
  }
  if (!studentIDPattern.test(studentIDInput.value)) {
    errorElement.textContent = "Please enter a 10 digit Student ID that start with 6 and followed by 0-6";
    return false;
  } else {
    errorElement.textContent = ""; // Clear the error message when valid
  }
  return true;
}

// Function to validate University Email
function validateEmail() {
  const emailInput = document.getElementById("email");
  const emailPattern = /^.*\.\w{3,}@dome\.tu\.ac\.th$/;
  const errorElement = document.getElementById("emailError");
  const hideEmail = document.getElementById("emailDisappear");

  if(emailInput.length !== 0){
    hideEmail.style.display = "none";
  }
  if (!emailPattern.test(emailInput.value)) {
    errorElement.textContent =
      "Please provide a valid university email in the format 'xxx.yyy@dome.tu.ac.th'.";
    return false;
  } else {
    errorElement.textContent = ""; // Clear the error message when valid
  }
  return true;
}

// Function to check worktitle input
function workTitleInput() {
  const workTitleInput = document.getElementById("workTitle");
  const errorWorkTitle = document.getElementById("titleCheck");
  const titleCheck = workTitleInput.value;

  if (!titleCheck) {
    errorWorkTitle.textContent = "Please enter work title";
    return false;
  } else{
    errorWorkTitle.textContent = "";
    return true;
  }
}

// Funtion to check academic year input
function academicYearInput(){
  const academicYearInput = document.getElementById("academicYear");
  const errorAcademicYear = document.getElementById("academicCheck");
  const academicCheck = academicYearInput.options[academicYearInput.selectedIndex]
  if(!academicCheck || academicCheck.value === ""){
    errorAcademicYear.textContent = "Please select academic year";
    return false;
  } else{
    errorAcademicYear.textContent = "";
    return true;
  }
}

// Funtion to check semester input
function semesterInput(){
  const semesterInput = document.getElementById("semester");
  const errorSemester = document.getElementById("semesterCheck");
  const semesterCheck = semesterInput.options[semesterInput.selectedIndex]
  if(!semesterCheck || semesterCheck.value === ""){
    errorSemester.textContent = "Please select semester";
    return false;
  } else{
    errorSemester.textContent = "";
    return true;
  }
}

// date validation//
function validateDateInputs() {
  const startDate = new Date(startDateInput.value);
  const endDate = new Date(endDateInput.value);
  const errorStartDateElement = document.getElementById("startDateError");
  const errorEndDateElement = document.getElementById("endDateError");
  const selectedStartDate = startDateInput.value;
  const selectedEndDate = endDateInput.value;

  if (!selectedStartDate||!selectedEndDate){
    if(!selectedStartDate){
      errorStartDateElement.textContent ="Please select start datetime";
    } else{
      errorStartDateElement.textContent ="";
    }
    if(!selectedEndDate){
      errorEndDateElement.textContent ="Please select end datetime";
    } else{
      errorEndDateElement.textContent ="";
    }
    return false;
  } else if (startDate >= endDate) {
    errorStartDateElement.textContent = "Start datetime should be befter the end datetime";
    errorEndDateElement.textContent = "End datetime should be after the start datetime";
    return false;
  } else {
    errorStartDateElement.textContent = "";
    errorEndDateElement.textContent = "";
    return true;
  }
}

// Function to validate form inputs on user input
function validateFormOnInput() {
  validateName();
  validateStudentID();
  validateEmail();
  workTitleInput();
  academicYearInput();
  semesterInput();
  validateDateInputs();
}

// Function to fetch activity types from the backend
async function fetchActivityTypes() {
  try {
    const response = await fetch(`http://${window.location.hostname}:${port}/getActivityType`);
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error("Failed to fetch activity types.");
      return [];
    }
  } catch (error) {
    console.error("An error occurred while fetching activity types:", error);
    return [];
  }
}

// Function to populate activity types in the select element
function populateActivityTypes(activityTypes) {
  const activityTypeSelect = document.getElementById("activityType");

  for (const type of activityTypes) {
    const option = document.createElement("option");
    option.value = type.id;
    option.textContent = type.value;
    activityTypeSelect.appendChild(option);
  }
}

// Event listener when the page content has finished loading
document.addEventListener("DOMContentLoaded", async () => {
  const activityTypes = await fetchActivityTypes();
  populateActivityTypes(activityTypes);
});

// Function to submit the form
async function submitForm(event) {
  event.preventDefault();

  // Validate form inputs before submission
  if (!validateName() || !validateStudentID() || !validateEmail() || !workTitleInput() || !academicYearInput() || !semesterInput() || !validateDateInputs()){
    return;
  }

  // Create the data object to send to the backend
  const formData = new FormData(event.target);
  const data = {
    first_name: formData.get("fullname").split(" ")[0],
    last_name: formData.get("fullname").split(" ")[1],
    student_id: parseInt(formData.get("studentID")),
    email: formData.get("email"),
    title: formData.get("workTitle"),
    type_of_work_id: parseInt(formData.get("activityType")),
    academic_year: parseInt(formData.get("academicYear")) - 543,
    semester: parseInt(formData.get("semester")),
    start_date: formData.get("startDate"),
    end_date: formData.get("endDate"),
    location: formData.get("location"),
    description: formData.get("description")
  };

  console.log(data);

  //Create span user's data
  const dataForSpan = {
    type_of_work_id: formData.get("activityType"),
    semester: formData.get("semester"),
  };
  const spanData = document.createElement('span');
  spanData.innerHTML = 
  "Name: " + data.first_name + " " + data.last_name + "<br>" +
  "ID: " + data.student_id + "<br>" +
  "Email: " + data.email + "<br>" +
  "Title: " + data.title + "<br>" +
  "Type: " + dataForSpan.type_of_work_id + "<br>" +
  "Academic Year: " + data.academic_year + "<br>" +
  "Semester: " + dataForSpan.semester + "<br>" +
  "Start Date: " + data.start_date + "<br>" +
  "End Date: " + data.end_date + "<br>" +
  "Location: " + data.location + "<br>" +
  "Description: " + data.description;

  const resultContainer = document.getElementById('resultContainer');
  resultContainer.innerHTML = '';
  resultContainer.appendChild(spanData);

  try {
    // Send data to the backend using POST request
    const response = await fetch(`http://${window.location.hostname}:${port}/record`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const responseData = await response.json();
      console.log("Form data submitted successfully!");

      // Format JSON data for display
      const formattedData = Object.entries(responseData.data)
        .map(([key, value]) => `"${key}": "${value}"`)
        .join("\n");

      // Display success message with formatted data
      alert(responseData.message + "\n" + formattedData);

      document.getElementById("myForm").reset();
    } else {
      console.error("Failed to submit form data.");

      // Display error message
      alert("Failed to submit form data. Please try again.");
    }
  } catch (error) {
    console.error("An error occurred while submitting form data:", error);
  }
}

// Event listener for form submission
document.getElementById("myForm").addEventListener("submit", submitForm);

// Event listeners for input validation on user input
document.getElementById("fullname").addEventListener("input", validateName);
document.getElementById("studentID").addEventListener("input", validateStudentID);
document.getElementById("email").addEventListener("input", validateEmail);
document.getElementById("workTitle").addEventListener("input", workTitleInput);
document.getElementById("academicYear").addEventListener("input", academicYearInput);
document.getElementById("semester").addEventListener("input", semesterInput);
const startDateInput = document.getElementById("startDate");
const endDateInput = document.getElementById("endDate");
startDateInput.addEventListener('input', validateDateInputs);
endDateInput.addEventListener('input', validateDateInputs);
