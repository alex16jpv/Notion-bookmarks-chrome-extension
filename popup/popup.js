const handleClickSaveBookmark = async (buttonRef) => {
  try {
    console.log("Saving bookmark...");
    buttonRef.classList.add("loading");

    const [tab] = await chrome.tabs.query({ active: true });
    if (!tab) {
      throw new Error("No active tab found");
    }

    const { favIconUrl, title, url } = tab;

    console.log(`Tab: ${title} (${url})`);
    console.log(`Favicon: ${favIconUrl}`);

    // TODO: add logic to save the bookmark on notion
  } catch (error) {
    console.log("Error saving bookmark:", error);
  } finally {
    buttonRef.classList.remove("loading");
  }
};

const main = async () => {
  const saveBookmarkButton = document.getElementById("save-bookmark");
  saveBookmarkButton.addEventListener("click", () => {
    handleClickSaveBookmark(saveBookmarkButton);
  });
};

main();
