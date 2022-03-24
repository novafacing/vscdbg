export class Frame {
  /**
   * Create a frame object.
   *
   * @param {object} options The options object.
   * @param {string} options.file The full path to a file.
   * @param {number} options.line The line number.
   * @param {string} [options.func] The func.
   * @param {number} [options.level] The level of stack frame.
   */
  constructor(options: {
    file: string;
    line: number;
    func?: string | undefined;
    level?: number | undefined;
  }) {
    /**
     * The full path to a file.
     *
     * @type {string}
     */
    this.file = options.file;

    /**
     * The line number.
     *
     * @type {number}
     */
    this.line = options.line;

    /**
     * The func.
     * @type {?string}
     */
    this.func = options?.func ?? null;

    /**
     * The level of stack frame.
     *
     * @type {?number}
     */
    this.level = options?.level ?? null;
  }
  /**
   * The full path to a file.
   *
   * @type {string}
   */
  file: string;
  /**
   * The line number.
   *
   * @type {number}
   */
  line: number;
  /**
   * The func.
   * @type {?string}
   */
  func: string | null;
  /**
   * The level of stack frame.
   *
   * @type {?number}
   */
  level: number | null;
}
