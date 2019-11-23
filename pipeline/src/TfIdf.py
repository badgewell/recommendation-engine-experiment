import apache_beam as beam

class TfIdf(beam.DoFn):

    def __init__(self, tf):
        super(TfIdf, self).__init__()
        self.tf = tf

    def process(self, element):
        if element[0] != 'id':
            for i in range(0 , len(self.tf)):
                element[i+1] = (element[i+1] * self.tf[i])
        return [element]
