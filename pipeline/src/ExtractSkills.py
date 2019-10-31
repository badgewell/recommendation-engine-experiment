import apache_beam as beam
import re

class ExtractSkills(beam.DoFn):
    
    def process(self, element):
        my_list = element.split(',')
        if my_list[0] == 'id':
            return []
        skills = self.skills_array(my_list[1:])  # css, html ..
        return skills

    def skills_array(self, df):
        temp_skills = []
        for skill in df:
            skill = skill.strip()
            skill = skill.replace(" ", "_")
            skill = re.sub(r'\W+', '_', skill)
            skill = skill.lower()
            if len(skill) > 0 :
                temp_skills.append(skill)
        return temp_skills
