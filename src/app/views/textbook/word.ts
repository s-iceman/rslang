export const createCard = (className: string) => {
  return `
    <div class="dictionary__card dictionary__card_${className}">
      <div>Cat</div>
      <div>Animal</div>
      <div>Example</div>
    </div>
  `;
};
