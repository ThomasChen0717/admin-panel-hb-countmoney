<template>
    <div>
    <input ref="avatar-upload-input" class="avatar-upload-input" type="file" accept = "image/png, image/jpeg" @change="handleFileChange">
    <div class="drop" @drop="handleDrop" @dragover="handleDragover" @dragenter="handleDragover">
      将文件拖到这里或
      <el-button :loading="loading" style="margin-left:16px;" size="mini" type="primary" @click="openFilePicker">
        浏览
      </el-button>
    </div>

    <!-- Temporary preview of the uploaded image -->
    <div v-if="imageDataUrl" class="image-preview">
      <img :src="imageDataUrl" alt="Uploaded Image" />
    </div>

    <!-- Button to initiate the database update -->
    <el-button :loading="saving" type="primary" style="margin-top: 16px;width:100%;margin-bottom:30px;" @click="saveImageToDatabase">
      上传
    </el-button>
  </div>
</template>
  
<script>
import {uploadAvatar} from '@/api/userInfo'
export default{
    name: 'changeAvatar',
    props: {
    user: {
      type: Object,
      default: () => {
        return {
          id: null
        }
      }
    }
  },
    data() {
        return {
            loading: false,
            saving: false,
            file: null,
            imageDataUrl: null
        };
    },
    methods: {
        handleFileChange(e) {
            this.file = e.target.files[0];
            this.previewImage();
        },
        handleDrop(e) {
            e.preventDefault();
            this.file = e.dataTransfer.files[0];
            this.previewImage();
        },
        handleDragover(e) {
            e.preventDefault();
        },
        openFilePicker() {
            this.$refs['avatar-upload-input'].click();
        },
        previewImage() {
            if (this.file) {
                const reader = new FileReader();
                reader.onload = () => {
                    this.imageDataUrl = reader.result;
                };
                reader.readAsDataURL(this.file);
            }
        },
        saveImageToDatabase() {
            if (this.file) {
                this.saving = true;
                const formData = new FormData();
                formData.append('image', this.file);
                formData.append('id', this.user.id)

                uploadAvatar(formData).then((response) => {
                    this.$message({
                            message: response.message,
                            type: 'success',
                            duration: 5 * 1000
                    })
                    this.saving = false
                })
                .catch(error => {
                    this.saving = false
                })
            }
        }        
    }
}
</script>

<style lang="scss">
    .avatar-upload-input{
    display: none;
    z-index: -9999;
    }
    .drop{
    border: 2px dashed #bbb;
    width: 600px;
    height: 160px;
    line-height: 160px;
    margin: 0 auto;
    font-size: 24px;
    border-radius: 5px;
    text-align: center;
    color: #bbb;
    position: relative;
    }

    .image-preview {
      display: flex;
      justify-content: center;
      margin-top: 30px;
      margin-bottom: 14px;
    }

    .image-preview img {
      max-width: 100%;
      max-height: 100%;
    }

</style>
  