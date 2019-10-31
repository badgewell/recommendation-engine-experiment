import apache_beam as beam
import numpy as np

class CreateDotProduct(beam.DoFn):
    
    def process(self, element, badgeMatrix):
        if element[0] != 'key':
            vec = map(float,element[1:])
        else:
            return

        matrix = []
        for i in badgeMatrix:
            if i[0] != 'id':
                row2 = map(float, i[1:])
                matrix.append(row2)

        np_matrix = np.array(np.transpose(matrix))
        np_vec = np.array(vec)
        if len(np_matrix) & len(np_vec):
            c = np.dot(np_vec,np_matrix).tolist()
            user_data  = {}
            sorted_data = {}
            for i in range(0,len(c)):
                user_data[badgeMatrix[i+1][0].encode('utf-8')] = c[i]

            sorted_obj = sorted(user_data.items(), key=lambda x: x[1], reverse=True)
            for i in range(0,12):
                sorted_data[sorted_obj[i][0]] = sorted_obj[i][1]

            yield '"'+element[0].encode('utf-8')+'" : '
            yield sorted_data
            yield ','
