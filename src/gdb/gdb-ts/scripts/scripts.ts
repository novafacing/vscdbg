export let base_py = `import gdb
import sys
import json


class BaseCommand(gdb.Command):
    """Base class for custom GDB commands."""

    def __init__(self, name):
        super(BaseCommand, self).__init__("gdbjs-" + name, gdb.COMMAND_USER)
        self.name = name

    def invoke(self, arg, from_tty):
        res = json.dumps(self.action(arg, from_tty), ensure_ascii=False)
        msg = '<gdbjs:cmd:{0} {1} {0}:cmd:gdbjs>'.format(self.name, res)
        sys.stdout.write(msg)
        sys.stdout.flush()`;
export let context_py = `import gdb
from builtins import str


class ContextCommand(BaseCommand):
    """Lists all symbols in the current context."""

    def __init__(self):
        super(ContextCommand, self).__init__("context")

    def action(self, arg, from_tty):
        frame = gdb.selected_frame()
        block = frame.block()
        names = set()
        variables = []
        while block:
            for symbol in block:
                name = symbol.name
                if (name not in names) and (symbol.is_argument or
                   symbol.is_variable or symbol.is_function or
                   symbol.is_constant):
                    scope = "global" if block.is_global else \
                            "static" if block.is_static else \
                            "argument" if symbol.is_argument else \
                            "local"
                    names.add(name)
                    variables.append({
                        "name": symbol.name,
                        "value": str(symbol.value(frame)),
                        "type": str(symbol.type),
                        "scope": scope
                    })
            block = block.superblock
        return variables

gdbjsContext = ContextCommand()`;

export let event_py = `import sys


def base_event_handler(name, msg):
    """Base handler for custom events."""

    sys.stdout.write('<gdbjs:event:{0} {1} {0}:event:gdbjs>'.format(name, msg))
    sys.stdout.flush()`;

export let exec_py = `import gdb
import sys
import re


class ExecCommand(BaseCommand):
    """Executes a CLI command and prints results."""

    def __init__(self):
        super(ExecCommand, self).__init__("exec")

    def action(self, arg, from_tty):
        res = gdb.execute(arg, False, True)
        # Results of CLI execution might accidently contain events.
        events = re.findall("<gdbjs:event:.*?:event:gdbjs>", res)
        for e in events: sys.stdout.write(e)
        return res

gdbjsExec = ExecCommand()`;

export let group_py = `import gdb


class ThreadGroupCommand(BaseCommand):
    """Returns the current thread group."""

    def __init__(self):
        super(ThreadGroupCommand, self).__init__("group")

    def action(self, arg, from_tty):
        inferior = gdb.selected_inferior()
        return { 'id': inferior.num, 'pid': inferior.pid }

gdbjsThreadGroup = ThreadGroupCommand()`;

export let objfile_py = `import gdb


def new_objfile_handler(event):
    """Handle the new objfile event."""

    base_event_handler('new-objfile', event.new_objfile.filename)

gdb.events.new_objfile.connect(new_objfile_handler)`;

export let sources_py = `import gdb
import re


class SourcesCommand(BaseCommand):
    """Search for source files using regex."""

    def __init__(self):
        super(SourcesCommand, self).__init__("sources")

    def action(self, arg, from_tty):
        info = gdb.execute("info sources", False, True)
        # XXX: not sure, whether there is a better way.
        info = re.sub("Reading symbols .*?\.{3}done\.", "", info)
        files = re.findall(r"([/\\].*?)[,\n]", info)
        return [f for f in files if re.search(arg, f)]

gdbjsSources = SourcesCommand()`;

export let thread_py = `import gdb


class ThreadCommand(BaseCommand):
    """Returns the current thread."""

    def __init__(self):
        super(ThreadCommand, self).__init__("thread")

    def action(self, arg, from_tty):
        thread = gdb.selected_thread()
        num = getattr(thread, 'global_num', None) or thread.num if thread else None
        inferior = gdbjsThreadGroup.action(arg, from_tty)
        return { "id": num or None, "group": inferior }

gdbjsThread = ThreadCommand()`;
