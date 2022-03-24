import { ThreadGroup } from "./group";

export interface SourceFilesOptions {
    group: ThreadGroup | null;
    pattern: string | null;
}
