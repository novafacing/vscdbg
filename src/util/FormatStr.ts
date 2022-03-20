export module FormatStr {
    export function format(...args: any[]): string {
        let fmtstr = args[0];
        args.shift();
        console.log("Formatting ", fmtstr, " with ", args);

        if (args.length) {
            const type = typeof args[0];
            const fmtargs =
                type === "string" || type === "number"
                    ? Array.prototype.slice.call(args)
                    : args[0];
            for (const fmtarg in fmtargs)
                fmtstr = fmtstr.replace(
                    new RegExp(`\\{${fmtarg}\\}`, "gi"),
                    fmtargs[fmtarg],
                );
        }
        return fmtstr;
    }
}
