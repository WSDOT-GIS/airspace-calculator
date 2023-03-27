/**
 * Creates and shows the disclaimer dialog.
 * @param parent - The parent element to which the dialog will be appended. Defaults to the document body.
 */
export function setupDisclaimer(parent: HTMLElement = document.body) {
  /**
   * The event handler for the close button
   * 1. Closes the dialog
   * 2. Removes this function from the button's "click" event listener.
   * 3. Removes the dialog from its parent element.
   * @this HTMLButtonElement - The close button
   */
  function closeForm(this: HTMLButtonElement, ev: MouseEvent) {
    dialog.close();
    agreeButton?.removeEventListener("click", closeForm);
    dialog.remove();
  }
  const templateId = "disclaimerTemplate";
  const template = document.querySelector<HTMLTemplateElement>(
    `#${templateId}`
  );
  if (!template) {
    throw new Error(`Could not find an element with an ID of ${templateId}`);
  }

  // Clone the template content.
  const clone = template.content.cloneNode(true) as DocumentFragment;
  // Create a dialog element and append it to the parent.
  const dialog = document.createElement("dialog");
  dialog.append(clone);
  // Find the "agree" button and attach the event listener that will
  // close the dialog when the user clicks it.
  const agreeButton = dialog.querySelector<HTMLButtonElement>(
    "#disclaimerAgreeButton"
  );
  agreeButton?.addEventListener("click", closeForm, {
    capture: false,
    once: true,
    passive: true,
    signal: undefined
  });

  parent.append(dialog);
  dialog.showModal();
}
