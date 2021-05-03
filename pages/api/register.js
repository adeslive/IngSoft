import formidable from 'formidable-serverless';
import path from 'path';
import fs from 'fs';
import { PrismaClient } from '@prisma/client';
import * as nodemailer from 'nodemailer';
const crypto = require('crypto');


const prisma = new PrismaClient();


export const config = {
    api: {
        bodyParser: false
    }
}

export default async (req, res) => {

    let fields = [];
    let files = [];
    const form = formidable.IncomingForm({
        keepExtensions: true,
    });

    const data = await new Promise( async (resolve, reject) => {
        form.on('file', (name, file) => {
            const data = fs.readFileSync(file.path);
            const extension = path.extname(file.path);
            const randomName = crypto.randomBytes(16).toString('hex');
            file.name = randomName + extension;
            fs.writeFileSync(`public/static/${file.name}`, data);
            fs.unlinkSync(file.path);
            files.push({name, file});
        })

        form.on('field', async (name, value) => {
            fields.push({ name, value });
        })

        await form.parse(req, (error, fields, files) => {
            if(error) return reject(error);
            resolve({fields, files});
        });
    })

    try {
        const user = await prisma.users.create({
            data: {
                first_name: data.fields.first_name,
                last_name: data.fields.last_name,
                identity: data.fields.identity,
                birthday: new Date(data.fields.birthday),
                email: data.fields.email,
                avatar: data.files.avatar ? '/static/' + data.files.avatar.name : ""
            }
        });

        let transport = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: "apolloacademyedu@gmail.com", // generated ethereal user
                pass: "yookyjsawyaafxwb", // generated ethereal password
            },
        });

        try {
            transport.sendMail({
                from: '"IngSoft" <apolloacademyedu@gmail.com>',
                to: user.email,
                subject: "Bienvenido",
                text: "Bienvenido",
                html: `<div style="margin: 4rem; background-color: LightGray; text-align: center; height: 500px">
                <div style="">
                  <h1>Bienvenido/a a Ing Soft</h1>
                  <div style="background-color: white; margin: 0 4rem 4rem 4rem; height:400px">
                    <div style="padding-top: 4rem">
                      <img src="http://18.189.235.128/${user.avatar}" style="align-self:center;"/>
                      <h2> ${user.first_name} ${user.last_name} te damos la bienvenida</h2>
                      <p> Esta es una aplicación de prueba para la clase de Ing Soft </p>
                      <p>Para ingresar a nuestra aplicación puedes ingresar en el siguiente enlace: <a href="http://18.189.235.128/" target="_blank">Ing Soft</a></p>
                    </div>
                    <div style="display: flex; margin: 4rem 10rem 0 10rem">
                      
                    </div>
                  </div>
                </div>
              </div>`
            })
        } catch (err) {

        }

        res.status(200).json(user);

    } catch (err) {
        console.log(err);
        files.forEach(element => {
            fs.unlinkSync(`public/static/${element.file.name}`);
        })
        res.status(200).json({ error: "Correo o identidad ya ingresado" });
    }
};