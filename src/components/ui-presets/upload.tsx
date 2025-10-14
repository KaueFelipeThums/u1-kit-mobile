import { toast } from '../ui/toast';
import {
  Upload as BaseUpload,
  UploadCameraTrigger,
  UploadFileList,
  UploadFileListActionIcon,
  UploadFileListActions,
  UploadFileListDescription,
  UploadFileListHeader,
  UploadFileListIcon,
  UploadFileListIconContent,
  UploadFileListInfo,
  UploadFileListItem,
  UploadFileListName,
  UploadFileListRemove,
  UploadPlaceholder,
  UploadTrigger,
  UploadTriggerContent,
} from '@/components/ui/upload';
import { prettyBytes } from '@/functions/pretty-bytes';

const IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];

type UploadProps = React.ComponentProps<typeof BaseUpload> & {
  placeholder?: string;
  showCamera?: boolean;
};

const Upload = ({ placeholder = 'Selecione um arquivo', showCamera, ...props }: UploadProps) => {
  return (
    <BaseUpload {...props} onError={(err) => err.type !== 'type' && toast.error({ title: err.message })}>
      <UploadTriggerContent>
        <UploadTrigger>
          <UploadPlaceholder>{placeholder}</UploadPlaceholder>
        </UploadTrigger>
        {showCamera && <UploadCameraTrigger />}
      </UploadTriggerContent>
      <UploadFileList
        renderItem={(files) =>
          files.map((file, index) => (
            <UploadFileListItem key={index} index={index}>
              <UploadFileListHeader>
                <UploadFileListIconContent>
                  <UploadFileListIcon name={IMAGE_MIME_TYPES.includes(file.type) ? 'Image' : 'File'} />
                </UploadFileListIconContent>
                <UploadFileListInfo>
                  <UploadFileListName numberOfLines={2}>{file.name}</UploadFileListName>
                  <UploadFileListDescription>{prettyBytes(file.size)}</UploadFileListDescription>
                </UploadFileListInfo>
                <UploadFileListActions>
                  <UploadFileListRemove>
                    <UploadFileListActionIcon name="X" />
                  </UploadFileListRemove>
                </UploadFileListActions>
              </UploadFileListHeader>
            </UploadFileListItem>
          ))
        }
      />
    </BaseUpload>
  );
};

export { Upload };
