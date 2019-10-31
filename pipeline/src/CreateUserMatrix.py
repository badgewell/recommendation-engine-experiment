import apache_beam as beam
from helper import preprocess_skillset

class CreateUserMatrix(beam.DoFn):

    def __init__(self, skillset):
        super(CreateUserMatrix, self).__init__()
        self.skillset = skillset

    def process(self, element):
        my_list = element.split(',')
        row = []
        if my_list[0] != 'key':
            row.append(my_list[0])
            obj = iter(preprocess_skillset(my_list[1:]))
            map = dict(zip(obj, obj))
            processedElement = preprocess_skillset(my_list[1::2])

            for skill in self.skillset:
                if skill in processedElement:
                    row.append(int(map[skill]))
                else:
                    row.append(0)
        else:
            row = list(self.skillset)
            row.insert(0, "key")
        if element[0] != "":
           return [row]

