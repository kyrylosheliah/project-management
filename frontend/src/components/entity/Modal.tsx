import type { z } from "zod";
import type { Entity } from "../../entities/Entity";
import type EntityService from "../../entities/EntityService";
import ButtonIcon from "../../ui/ButtonIcon";
import { Modal } from "../../ui/Modal";
import { IconClose } from "../../ui/icons/Close";
import type { ReactNode } from "react";
import { EntityForm } from "./Form";
import { entityDefaultValues } from "../../entities/EntityMetadata";

export const EntityModal = <
  T extends Entity,
  TSchema extends z.ZodType<Omit<T, "id">>,
>(params: {
  opened: boolean;
  icon?: ReactNode;
  heading: ReactNode;
  close: () => void;
  update?: (id: number, newValues: Omit<T, 'id'>) => Promise<boolean>;
  create?: (newValues: Omit<T, 'id'>) => Promise<boolean>;
  entityId: number | null;
  service: EntityService<T, TSchema>;
}) => {
  const { data, isPending, isSuccess } = params.service.useGet(
    params.entityId || 0
  );
  return (
    <Modal
      opened={params.opened}
      icon={params.icon}
      heading={params.heading}
      close={params.close}
      className="flex flex-col items-center justify-center backdrop-blur-sm bg-transparent"
    >
      {params.create === undefined ? (
        isPending ? (
          <div>Loading ...</div>
        ) : isSuccess ? (
          <EntityForm
            edit
            service={params.service}
            entity={data as T}
            onSubmit={(newFields: Omit<T, "id">) =>
              params.update!(params.entityId!, newFields)
            }
          />
        ) : (
          <div>Error</div>
        )
      ) : (
        <EntityForm
          edit
          service={params.service}
          entity={entityDefaultValues(params.service.metadata.fields)}
          onSubmit={(newFields: Omit<T, "id">) => params.create!(newFields)}
        />
      )}
    </Modal>
  );
};
