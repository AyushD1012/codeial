const queue= require('../config/kue');

const commentsMailer= require('../mailers/comments_mailer');

queue.process('emails',function(job,done){
    console.log('emails Worker is processing a job', job.data);

    commentsMailer.newComment(job.data);
    done();
});