const google = require('googleapis');

export const launchPipeline = (req, res) => {
    google.google.auth.getApplicationDefault(function (err, authClient, projectId) {
        if (err) {
            console.error('Error occurred: ' + err.toString());
            throw new Error(err);
        }
        const dataflow = google.google.dataflow({ version: 'v1b3', auth: authClient });
        
        dataflow.projects.templates.launch({
            projectId: projectId,
            gcsPath: 'gs://badgewell-reco/templates/pipeline_template'
        }, function(err, response) {
            if (err) {
                console.error("Problem running dataflow template, error was: ", err);
                res.status(500).send()
            }
            console.log("Dataflow template response: ", response);
            res.status(200).send()
        });
    });
};