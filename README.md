Nhóm 22: Đề tài xây dựng trang web hỗ trợ học trực tuyến <br><br>
Đây là phần back-end của đề tài, được tách riêng biệt với back-end <br><br>
Công nghệ sử dụng : NodeJS + Express  <br>
        database: monggodb <br><br>
Hướng dẫn cài đặt : Để có thể chạy đúng các chức năng, bạn phải tải về máy của mình cả 2 phần của đề tài là front-end và back-end <br><br>
    <a href="https://gitlab.com/soict-it4409/20192/nhom22/baitaplon_frontend " >Link front-end</a> <br><br>
    + Khi tải về máy, bạn cd vào thư mục chứa mã nguồn của ứng dụng web<br>
    + Chạy lệnh : npm start <br>
    + Bật terminal khác và chạy lệnh docker: docker run -p 4443:4443 --rm -e OPENVIDU_SECRET=MY_SECRET openvidu/openvidu-server-kms:2.14.0<br><br>
Yêu cầu môi trường : đã cài đặt NodeJS, monggodb, docker
