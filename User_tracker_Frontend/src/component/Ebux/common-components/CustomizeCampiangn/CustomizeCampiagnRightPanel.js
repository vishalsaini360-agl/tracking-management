import { MdOutlineDragIndicator } from "react-icons/md";
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { RxCross2 } from "react-icons/rx";
import { ENTITY_TYPE, EVENTS, trackCustomEvent, TRACKING_COMPONENT } from "../../../../tracker";

function SortableItem({ id, index, item, isDraggable, removeColumn, isRemovable }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id, disabled: !isDraggable });

  const style = {
    transform: CSS?.Transform?.toString(transform),
    transition,
    zIndex: transform ? 999 : "auto",
    position: transform ? "relative" : "static",
    cursor: isDraggable ? "grab" : "not-allowed",
    opacity: isDraggable ? 1 : 0.5,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      key={index}
      className="flex items-center justify-between bg-gray-100 p-1 rounded  hover:bg-gray-200"
    >
      <div className="flex items-center space-x-3">
        {isDraggable && (
          <MdOutlineDragIndicator
            {...(isDraggable ? listeners : {})}
            {...attributes}
          />
        )}
        <span className="text-gray-700 px-2">{item?.title}</span>
      </div>
      {item?.remove == false || isRemovable ? (
        <></>
      ) : (
        <RxCross2
          className="cursor-pointer"
          size={18}
          color="#53545E"
          onClick={() => {
            removeColumn(item)
            trackCustomEvent(
              EVENTS.REMOVE,
              { item: item?.title },
              ENTITY_TYPE.Customize_Column,
              {
                component_type: TRACKING_COMPONENT.BUTTON
              }
            );
          }}
        />
      )}
    </li>
  );
}
const CustomizeCampiagnRightPanel = ({
  selectedOptions,
  setSelectedOptions,
  isRemovable,
  removeColumn = () => { },
}) => {

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (over && active?.id !== over?.id) {
      setSelectedOptions((prevSelectedOptions) => {

        const oldIndex = prevSelectedOptions.findIndex(
          (item) => item.value === active.id
        );
        const newIndex = prevSelectedOptions.findIndex(
          (item) => item.value === over.id
        );
        const newdata =
          !(prevSelectedOptions?.[oldIndex]?.drag == false) &&
            !(prevSelectedOptions?.[newIndex]?.drag == false)
            ? arrayMove(prevSelectedOptions, oldIndex, newIndex)
            : prevSelectedOptions;
        // newdata.map((item, index) => ({
        //   value: item.value,
        //   position: index + 1
        // }));

        trackCustomEvent(
          EVENTS.Drag_End,
          { item: newdata?.[newIndex]?.title },
          ENTITY_TYPE.Customize_Column,
          {
            component_type: TRACKING_COMPONENT.BUTTON
          }
        );
        return newdata;
      });
    }
  };
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 10 } }),
    useSensor(TouchSensor)
  );
  return (
    <>
      {selectedOptions.length > 0 && (
        <h1 className="campaignRightPanel ml-4">
          {`${selectedOptions.length} Column Selected`}
        </h1>
      )}
      <div className="h-full overflow-y-auto bg-gray-50 p-4 rounded shadow-lg">

        {selectedOptions
          ?.filter((i) => i?.type == "breakdown")
          ?.length ?
          <div className="mb-2 bg-white p-4 rounded shadow-lg">
            <div className="mr-1 font-semibold">Breakdowns</div>

            <ul className="space-y-2">
              <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                <SortableContext
                  items={selectedOptions
                    ?.filter((i) => i?.type == "breakdown")
                    ?.map((item) => item.value)}
                >
                  {selectedOptions
                    ?.filter((i) => i?.type == "breakdown")
                    ?.map((item, index) => (
                      <SortableItem
                        index={index}
                        key={item.value}
                        id={item.value}
                        item={item}
                        isDraggable={!(item?.drag == false)}
                        removeColumn={removeColumn}
                        isRemovable={isRemovable}
                      />
                    ))}
                </SortableContext>
              </DndContext>
            </ul>
          </div>
          : <></>}
        {selectedOptions
          ?.filter((i) => i?.type != "breakdown")
          ?.length ?
          <div className="bg-white p-4 rounded shadow-lg">
            <div className="mr-1 font-semibold">Matrices</div>
            <ul className="space-y-2">
              <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                <SortableContext
                  items={selectedOptions
                    ?.filter((i) => i?.type != "breakdown")
                    ?.map((item) => item.value)}
                >
                  {selectedOptions
                    ?.filter((i) => i?.type != "breakdown")
                    ?.map((item, index) => (
                      <SortableItem
                        index={index}
                        key={item.value}
                        id={item.value}
                        item={item}
                        isDraggable={!(item?.drag == false)}
                        removeColumn={removeColumn}
                        isRemovable={isRemovable}
                      />
                    ))}
                </SortableContext>
              </DndContext>
            </ul>
          </div>
          : <></>}
      </div>
    </>
  );
};

export default CustomizeCampiagnRightPanel;
