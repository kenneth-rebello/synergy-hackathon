module.exports =  function createPDF(projects){
    const PDFDocument = require('pdfkit');
    const fs = require('fs');
    const path = require('path');
    let tx=0,nx=100,dx=200,ty=0,ny=0,dy=0;
    let i = 0;
    
    projects.forEach(function(project){
        // if (i === 0){

        // }
        const {uploader, title, dateOfUpload, domain} = project;
        const { name, dept} = uploader
        const doc = new PDFDocument;
        

        doc.pipe(fs.createWriteStream(path.join(__dirname,'../','report.pdf')));

        doc.font('public/styles/fonts/Gayathri/Gayathri-Bold.ttf')
        .fontSize(25)
        .text(title,tx, ty+150);

        doc.font('public/styles/fonts/Gayathri/Gayathri-Bold.ttf')
        .fontSize(25)
        .text(name,tx, ty+150);

        doc.font('public/styles/fonts/Gayathri/Gayathri-Bold.ttf')
        .fontSize(25)
        .text(domain,tx, ty+150);

        console.log('creating');
        // Finalize PDF file
        doc.end();

    })
        
}