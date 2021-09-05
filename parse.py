import hpp2plantuml
import sys

diag = hpp2plantuml.Diagram()
diag.create_from_string(" ".join(str(x) for x in sys.argv[1:]))
print(diag.render())