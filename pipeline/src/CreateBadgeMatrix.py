import apache_beam as beam
from helper import preprocess_skillset

class CreateBadgeMatrix(beam.DoFn):

    def __init__(self, skillset):
        super(CreateBadgeMatrix, self).__init__()
        self.skills = skillset

    def process(self, element):
        my_list = element.split(',')
        row = list()
        row.append(my_list[0])
        processedElement = preprocess_skillset(my_list)
        if processedElement[0] != "id":
            for skill in self.skills:
                if skill in processedElement:
                    row.append(1)
                else:
                    row.append(0)
        else:
            row = list(self.skills)
            row.insert(0, "id")
        return [row]
