export class Variable {
  /**
   * Create a variable object.
   * Usually you don't need to create it yourself.
   *
   * @param {object} options The options object.
   * @param {string} options.name The name of the variable.
   * @param {string} options.type The type of the variable.
   * @param {string} options.scope The scope of the variable.
   * @param {string} options.value The value of the variable.
   */
  constructor(options: {
    name: string;
    type: string;
    scope: string;
    value: string;
  }) {
    /**
     * The name of the variable.
     *
     * @type {string}
     */
    this.name = options.name;

    /**
     * The type of the variable.
     *
     * @type {string}
     */
    this.type = options.type;

    /**
     * The scope of the variable.
     *
     * @type {string}
     */
    this.scope = options.scope;

    /**
     * The value of the variable.
     *
     * @type {string}
     */
    this.value = options.value;
  }
  /**
   * The name of the variable.
   *
   * @type {string}
   */
  name: string;
  /**
   * The type of the variable.
   *
   * @type {string}
   */
  type: string;
  /**
   * The scope of the variable.
   *
   * @type {string}
   */
  scope: string;
  /**
   * The value of the variable.
   *
   * @type {string}
   */
  value: string;
}
