//GLOBAL//
const MAX_CHARS = 150;
const textareaEl = document.querySelector(".form__textarea");
const counterEl = document.querySelector(".counter");
const subBTN = document.querySelector(".submit-btn");
const formEl = document.querySelector(".form");
const feedbackListEl = document.querySelector(".feedbacks");
const spinnerEl = document.querySelector(".spinner");
const BASE_API_URL = "https://bytegrad.com/course-assets/js/1/api";
const hashtagListEl = document.querySelector(".hashtags");

const feebackItemRender = (feedbackItem) => {
  // new feedback item HTML
  const feedbackItemHTML = `
      <li class="feedback">
          <button class="upvote">
              <i class="fa-solid fa-caret-up upvote__icon"></i>
              <span class="upvote__count">${feedbackItem.upvoteCount}</span>
          </button>
          <section class="feedback__badge">
              <p class="feedback__letter">${feedbackItem.badgeLetter}</p>
          </section>
          <div class="feedback__content">
              <p class="feedback__company">${feedbackItem.company}</p>
              <p class="feedback__text">${feedbackItem.text}</p>
          </div>
          <p class="feedback__date">${
            feedbackItem.daysAgo === 0 ? "new" : `${feedbackItem.daysAgo}d`
          }</p>
      </li>
  `;

  // insert new feedback item in list
  feedbackListEl.insertAdjacentHTML("beforeend", feedbackItemHTML);
};

// COUNTER COMPONENT//

const inputHandler = () => {
  const maxChars = MAX_CHARS;
  const charsTyped = textareaEl.value.length;
  counterEl.textContent = maxChars - charsTyped;
};
textareaEl.addEventListener("input", inputHandler);

// SUBMIT COMPONENT//

const showVisualIndicator = (textCheck) => {
  const className = textCheck === "valid" ? "form--valid" : "form--invalid";
  formEl.classList.add(className);
  setTimeout(() => {
    formEl.classList.remove(className);
  }, 2000);
};

const submitHandler = () => {
  const text = textareaEl.value;
  if (text.includes("#") && text.length >= 5) {
    showVisualIndicator("valid");
  } else {
    showVisualIndicator("invalid");
    return;
  }
  const hashtag = text.split(" ").find((word) => word.includes("#"));
  const company = hashtag.substring(1);
  const badgeLetter = company.substring(0, 1).toUpperCase();
  const upvoteCount = 0;
  const daysAgo = 0;

  // creat feedback item object//
  const feedbackItem = {
    upvoteCount,
    badgeLetter,
    company,
    daysAgo,
    text,
  };

  // rednering feedback item//
  feebackItemRender(feedbackItem);

  // post data//
  fetch(`${BASE_API_URL}/feedbacks`, {
    method: "POST",
    body: JSON.stringify(feedbackItem),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        console.log("somthing went wrong");
        return;
      }
      console.log("succesfully submited");
    })
    .catch((error) => console.log(error));

  textareaEl.value = "";
  subBTN.blur();
  counterEl.textContent = MAX_CHARS;
};
subBTN.addEventListener("click", submitHandler);

const clickHandler = (event) => {
  const clickedEl = event.target;
  const upvoteIntestion = clickedEl.className.includes("upvote");

  if (upvoteIntestion) {
    const upvoteBtnEl = clickedEl.closest(".upvote");
    upvoteBtnEl.disabled = true;
    const upvoteCountEl = upvoteBtnEl.querySelector(".upvote__count");
    let upvoteCount = +upvoteCountEl.textContent;
    upvoteCountEl.textContent = ++upvoteCount;
  } else {
    clickedEl.closest(".feedback").classList.toggle("feedback--expand");
  }
};

feedbackListEl.addEventListener("click", clickHandler);

// FEEDBACK  ITEMS//

fetch(`${BASE_API_URL}/feedbacks`)
  .then((response) => response.json())
  .then((data) => {
    spinnerEl.remove();
    data.feedbacks.forEach((feedbackItem) => {
      feebackItemRender(feedbackItem);
    });
  })
  .catch((error) => {
    feedbackListEl.textContent = `faild to fetch feedback items. error message: ${error.message}`;
  });

const clickhandler2 = (event) => {
  const clickedEl = event.target;
  // stop func when clicked on the list and not on the item//
  if (clickedEl.className === "hashtags") return;
  const companyNameFromHashtag = clickedEl.textContent
    .substring(1)
    .toLowerCase()
    .trim();
  feedbackListEl.childNodes.forEach((childnode) => {
    if (childnode.nodeType === 3) return;
    const companyNameFromFeedbackList = childnode
      .querySelector(".feedback__company")
      .textContent.toLowerCase()
      .trim();
    if (companyNameFromHashtag !== companyNameFromFeedbackList) {
      childnode.remove();
    }
  });
};

hashtagListEl.addEventListener("click", clickhandler2);
