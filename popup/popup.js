const getPageDescription = (tabId) => {
  return new Promise((resolve) => {
    chrome.scripting.executeScript(
      {
        target: { tabId },
        func: () => {
          const metaDescription = document.querySelector(
            'meta[name="description"]'
          );

          if (metaDescription) {
            return metaDescription.getAttribute("content");
          }

          return "";
        },
      },
      (result) => {
        if (result && result[0] && result[0].result) {
          resolve(result[0].result);
        }
        resolve("");
      }
    );
  });
};

const getTabInfo = async () => {
  const [tab] = await chrome.tabs.query({ active: true });
  if (!tab) {
    throw new Error("No active tab found");
  }

  const { favIconUrl, title, url } = tab;
  const description = await getPageDescription(tab.id);

  return { favIconUrl, title, url, description };
};
const handleClickSaveBookmark = async ({
  title,
  url,
  favIconUrl,
  description,
}) => {
  try {
    const bookmark = {
      title,
      url,
      favIconUrl,
      description,
    };

    // TODO: add logic to save the bookmark on notion
    console.log("Bookmark:", bookmark);
  } catch (error) {
    console.log("Error saving bookmark:", error);
  }
};

const main = async () => {
  const tabs = {
    list: document.getElementById("list"),
    save: document.getElementById("save"),
  };
  const contents = {
    list: document.getElementById("list-content"),
    save: document.getElementById("save-content"),
  };

  const formItems = {
    title: document.getElementById("title"),
    url: document.getElementById("url"),
    description: document.getElementById("description"),
    favicon: document.getElementById("favicon-img"),
    save: document.getElementById("save-button"),
  };

  Object.values(tabs).forEach((tab) => {
    tab.addEventListener("click", () => {
      Object.values(tabs).forEach((tab) => tab.classList.remove("active"));
      Object.values(contents).forEach((content) =>
        content.classList.remove("active")
      );

      tab.classList.add("active");
      contents[tab.id].classList.add("active");
    });
  });

  const tabInfo = await getTabInfo();

  // fill form values with tab info
  formItems.title.value = tabInfo.title;
  formItems.url.value = tabInfo.url;
  formItems.favicon.src = tabInfo.favIconUrl;
  // add value to description its a textarea
  formItems.description.innerHTML = tabInfo.description;

  formItems.save.addEventListener("click", (e) => {
    handleClickSaveBookmark({
      title: formItems.title.value,
      url: formItems.url.value,
      favIconUrl: tabInfo.favIconUrl,
      description: formItems.description.value,
    });
  });

  // alert(tabInfo.favIconUrl);
};

main();
