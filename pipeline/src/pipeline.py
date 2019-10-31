import argparse
from apache_beam.options.pipeline_options import PipelineOptions

from ExtractSkills import *
from CreateBadgeMatrix import *
from CreateUserMatrix import *
from CreateDotProduct import *
from TfIdf import TfIdf as tf_idf
from helper import *

badge_inprefix = '/badge.csv'
user_inprefix = '/user.csv'
skill_outprefix = '/skills'
dotProduct_outprefix = '/dotProductWithout{}'

def run(
    beam_options=None,
    input=None,
    output=None,
    environment=None):

    if beam_options and not isinstance(beam_options, PipelineOptions):
        raise ValueError(
            '`beam_options` must be {}. '
            'Given: {} {}'.format(PipelineOptions,
                                  beam_options, type(beam_options)))

    with beam.Pipeline(options=beam_options) as p:
        _ = (
            p
            | 'Read Badge File from GCS' >> beam.io.ReadFromText(input+badge_inprefix)
            | 'Extract Skills list' >> beam.ParDo(ExtractSkills())
            | 'Write processed skills to GCS' >> beam.io.WriteToText(output+skill_outprefix,num_shards=1,file_name_suffix='.csv')
        )

    if environment == "local":
        skills_df = pd.read_csv(output+'/skills-00000-of-00001.csv', header=None)
    else:
        skills_df = read_csv_gcs(output+'/skills-00000-of-00001.csv')
    skillset = skills_df[0].unique().tolist()
    skillmap = create_mapping(skills_df[0].tolist())

    with beam.Pipeline(options=beam_options) as p:
        tfidfMatrix = (
            p
            |'Read Badge File from GCS -2' >> beam.io.ReadFromText(input+badge_inprefix)
            |'Create Badge Matrix' >> beam.ParDo(CreateBadgeMatrix(skillset))
            |'Create tf-idf for Badge Matrix' >> beam.ParDo(tf_idf(create_idf(skillmap, skillset, badgesCount)))
        )

        userMatrix = (
            p
            | 'Read User File from GCS' >> beam.io.ReadFromText(input+user_inprefix)
            | 'Create User Matrix' >> beam.ParDo(CreateUserMatrix(skillset))
            | "Generate preference Matrix" >> beam.ParDo(CreateDotProduct(),badgeMatrix=beam.pvalue.AsList(tfidfMatrix))
            | "Write Matrix to GCS" >> beam.io.WriteToText(output+dotProduct_outprefix,file_name_suffix='.json')
        )


if __name__ == '__main__':
    """Main entry point; defines and runs the pipeline."""
    parser = argparse.ArgumentParser(
        formatter_class=argparse.ArgumentDefaultsHelpFormatter)

    parser.add_argument('--input',
                        dest='input',
                        required=True,
                        help='Input file badge to process.')
    parser.add_argument('--output',
                        dest='output',
                        required=True,
                        help='output processed file.')
    parser.add_argument('--environment',
                        dest='environment',
                        required=True,
                        help='environment local or cloud')

    args, pipeline_args = parser.parse_known_args()
    beam_options = PipelineOptions(pipeline_args, save_main_session=True)

    if args.environment == "local" :
        badges_df = pd.read_csv(args.input+badge_inprefix)
    else :
        badges_df = read_csv_gcs(args.input+badge_inprefix,0)
    badgesCount = len(badges_df)
    badge_file_header = badges_df.columns.values
    badge_file_header = list(np.array(badge_file_header))

    run(
        beam_options=beam_options,
        input=args.input,
        output=args.output,
        environment=args.environment)
