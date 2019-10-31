import re, math
import pandas as pd
import gcsfs as gcsfs

def read_csv_gcs(filename , header=None):
#     # read file from gcs
#     fs = gcsfs.GCSFileSystem(project='careerograph-e9963')
#     with fs.open(filename) as f:
#         df = pd.read_csv(f,header=header)
#     return df
    return True
# performs preprocessing on a list of skills
def preprocess_skillset(skillset):
    tempSkillset = list()
    for skill in skillset:
        # remove the trailing space, replace space with underscore,
        skill = skill.strip()
        skill = skill.replace(" ", "_")
        skill = re.sub(r'\W+', '_', skill)
        tempSkillset.append(skill.lower())
    return tempSkillset

def create_idf(map ,skills , count):
    idf = list()
    # get idf for each skill
    for skill in skills:
        idf.append(math.log(count/map[skill]))
    return idf

def create_mapping(skillset):
    # create mapping for every skill and its count ex: html: 2
    mapping = dict()
    for skill in skillset:
        if skill not in mapping:
            mapping[skill] = 1
        else:
            mapping[skill] += 1
    return mapping