export class ThreadGroup {
  /**
   * Create a thread group object.
   * Usually you don't need to create it yourself unless
   * you're doing some low-level stuff.
   *
   * @param {number} id The internal GDB ID of a thread group.
   * @param {object} [options] The options object.
   * @param {string} [options.executable] The executable of target.
   * @param {number} [options.pid] The PID of the thread-group.
   */
  constructor(
    id: number,
    options?:
      | {
          executable?: string | undefined;
          pid?: number | undefined;
        }
      | undefined
  ) {
    /**
     * The internal GDB ID of a thread group.
     *
     * @type {number}
     */
    this.id = id;

    /**
     * The executable of target.
     *
     * @type {?string}
     */
    this.executable = options?.executable ?? null;

    /**
     * The PID of the thread-group.
     *
     * @type {?number}
     */
    this.pid = options?.pid ?? null;
  }
  /**
   * The internal GDB ID of a thread group.
   *
   * @type {number}
   */
  id: number;
  /**
   * The executable of target.
   *
   * @type {?string}
   */
  executable: string | null;
  /**
   * The PID of the thread-group.
   *
   * @type {?number}
   */
  pid: number | null;
}
