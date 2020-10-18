const CORS_API_URL = `https://cors-anywhere.herokuapp.com/`;
const HOST_URL = `https://www.smb.museum/en/rss-feed/exhibitions.xml`;
const URL = `${CORS_API_URL}${HOST_URL}`;

getHtmlDataFromFeed(URL);

const createArticleElement = ({ url, title, description }) => {
  const desc = description ? `<p>${description}</p>` : "";

  if (!title) {
    return;
  }

  return `
    <a href="${url}" alt="link" target="_blank">
      <article>
        <h2>${title}</h2>
        ${desc}
      </article>
    </a>
  `;
};

function updateDom(articleElements) {
  const app = document.getElementById("app");
  const html = articleElements.join("");

  app.insertAdjacentHTML("beforeend", html);
}

function getDataFromItems(items) {
  let articleElements = [];

  items.forEach((item) => {
    const url = item.querySelector("link").innerHTML;
    const title = item.querySelector("title").innerHTML;
    const description = item.querySelector("description").textContent;

    articleElements.push(createArticleElement({ url, title, description }));
  });

  return updateDom(articleElements);
}

async function getHtmlDataFromFeed(url) {
  try {
    const response = await fetch(url).then((response) => response);
    const html = await response
      .text()
      .then((htmlString) =>
        new window.DOMParser().parseFromString(htmlString, "text/xml")
      );
    const items = html.querySelectorAll("item");

    console.log(response);

    if (items) {
      return getDataFromItems(items);
    }
  } catch (error) {
    console.error(`ERROR: ${error}`);
  }
}
