import React, {ReactNode} from 'react';
import CourseSheet from './CourseSheet';

interface CourseSheetsProps {
    id: string,
    courseSheets: any,
    className: string,
    activeRemoveButton: boolean,
    removableHashtags: boolean,
    delete: ((event: React.MouseEvent<HTMLImageElement, MouseEvent>) => void) | undefined,
}

class CourseSheets extends React.Component<CourseSheetsProps, { courseSheets: [] }> {

    public constructor(props: CourseSheetsProps) {
        super(props);
        this.renderCourseSheets = this.renderCourseSheets.bind(this);
    }

    public renderCourseSheets(): ({} | null | undefined)[] {
        // @ts-ignore
        if (this.props.courseSheets['success']) {
            let res = this.props.courseSheets['data'].map((courseSheet: any) =>
                <CourseSheet
                    id={courseSheet['id_course_sheet']}
                    idLobby={this.props.id}
                    key={courseSheet['id_course_sheet']}
                    title={courseSheet['title']}
                    pseudo={courseSheet['pseudo']}
                    publication_date={courseSheet['publication_date']}
                    link={courseSheet['file_name']}
                    description={courseSheet['description']}
                    activeRemoveButton={this.props.activeRemoveButton}
                    removableHashtags={this.props.removableHashtags}
                    delete={this.props.delete}
                />
            );
            return res;
        } else {
            return [];
        }
    }

    public render(): ReactNode {
        return (
            <div className={'course-sheets-section ' + this.props.className}>
                {this.renderCourseSheets()}
            </div>
        )
    }
}

export default CourseSheets;
